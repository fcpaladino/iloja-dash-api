import {Sequelize} from "sequelize-typescript";
import {Op, WhereOptions } from "sequelize";
import paginate from "../config/paginate";
import { setRedis } from "../redis";
import { Expr, parse } from 'pgsql-ast-parser';
import { InvalidCache, extractTableNameFromSQL, generateRedisCacheKey, getCache } from "../helpers/Cache";
import { sequelize } from "../database";
import {logDev} from "../utils/helpers";
import app from "../config/app";

const cacheTime = 8 * 60 * 60; // 5 hour in seconds

export const metaPaginate = (page: number, limit: number, count: number) => {
  return {
    meta: {
      limitPage: limit,
      totalPage: Math.ceil((count)/limit),
      activePage: page,
      totalItems: count,
    }
  }
};

export const itemsWithMetaPaginate = (items:any, page: number, count: number, limit: number|null = null) => {
  const itemsByPage = limit ? limit : paginate.itemsByPage;
  return {
    items: items,
    ...metaPaginate(page, itemsByPage, count)
  }
};

export const getOffSet = (page: number): number => {
  const limit = paginate.itemsByPage;
  return limit * (page - 1);
};

export const whereSearch = (col: string, op: 'like' | 'bool' | '=' | 'in', value: any): WhereOptions => {
  if (value === undefined || value === null) return {};

  switch (op) {
    case 'like':
      if (typeof value === 'string' && value.trim().length > 0) {
        const sanitizedValue = `%${value.trim()}%`;
        return {
          [Op.or]: [
            Sequelize.where(
              Sequelize.fn('unaccent', Sequelize.col(col)),
              {
                [Op.iLike]: Sequelize.fn('unaccent', sanitizedValue)
              }
            )
          ]
        };
      }
      break;

    case 'bool':
      if (String(value) !== '-1') {
        const boolValue =
          typeof value === 'boolean'
            ? value
            : String(value).toLowerCase() === 'true';
        return {
          [col]: boolValue
        };
      }
      break;

    case '=':
      if(String(value) !== '-1') {
        return {
          [col]: value
        };
      }
      break;

    case 'in':
      return {
        [col]: {
          [Op.in]: Array.isArray(value) ? value : [value]
        }
      };
  }

  return {};
};


export const AddOverrideQuery = () => {
  const originalQuery = sequelize.query.bind(sequelize);
  sequelize.query = async function (sql: any, options = {} as any) {


    options.bind = sql.bind || options.bind;
    options.replacements = sql.replacements || options.replacements;

    const useCache = options.UseCache ?? false;
    const sqlRaw = sql.query || sql;
    let sqlToExecute = sqlRaw;
    const companyId = getCompanyIdValue(sqlRaw, options);
    const cacheKey = generateRedisCacheKey(companyId, sqlRaw, options);

    if ((options.type === 'SELECT') && cacheKey !== '') {
      let cachedResult = await getCache(options, cacheKey);
      if (cachedResult !== null) {
        cachedResult.sourceDb = 'cache';
        return cachedResult;
      }
    }

    await clearCacheForModifiedTables(sqlRaw, options, companyId);

    const callSite = getCallSiteFromStack();
    if (callSite && typeof sqlRaw === "string") {
      sqlToExecute = `/* API: ${callSite} */\n${sqlRaw}`;
    } else {
      logDev("⚠️", "CALLSITE_NOT_FOUND", sqlRaw);
    }

    const result = await originalQuery(sqlToExecute, options);

    if ((options.type === 'SELECT') && useCache) {
      await setRedis(cacheKey, result, cacheTime);
    }

    return result;

  };

}

async function clearCacheForModifiedTables(sqlRaw: string, options: any, companyId: number): Promise<void> {
  if (['UPDATE', 'INSERT', 'BULKUPDATE', 'BULKINSERT', 'DELETE', 'BULKDELETE'].includes(options.type)) {

    if (app.env !== "dev") {
      if (companyId == null)
        logDev("☢️", "UPDATE_CACHE", "WITHOUT", sqlRaw)
    }

    const tables = extractTableNameFromSQL(sqlRaw);
    await Promise.all(tables.map(async (tableName: string) => {
      await InvalidCache(tableName, companyId);
    }));
  }
}


function getCompanyIdValue(sql: string, options: any): number | null {

  const ret = getWhereFieldValue(sql, options, 'companyId');
  return ret;

}


function getWhereFieldValue(sql: string, options: any, field: string): number | null {

  let companyId: number | null;

  try {

    const ast = parse(sql)?.[0];
    if (!ast) return null;
    let where: Expr | undefined;

    if (ast.type === 'update' || ast.type === 'select') {
      where = (ast as any).where;
    }

    if (!where) {
      companyId = options.companyId || null;

    } else {
      const companyIdBodyQuery = extractFieldValue(where, field.toLowerCase());
      companyId = options.companyId || companyIdBodyQuery || null;
    }

    return companyId

  } catch (error) {
    companyId = options.companyId || null;
  } finally {
    return companyId
  }


}

function extractFieldValue(expr: Expr, field: string): number | null {
  if (expr.type !== 'binary') return null;

  // campo = valor
  if (expr.op === '=' && expr.left.type === 'ref' && expr.left.name === field) {
    return getValue(expr.right);
  }

  // valor = campo
  if (expr.op === '=' && expr.right.type === 'ref' && expr.right.name === field) {
    return getValue(expr.left);
  }

  // AND/OR aninhado
  const left = extractFieldValue(expr.left, field);
  if (left !== null) return left;

  const right = extractFieldValue(expr.right, field);
  if (right !== null) return right;

  return null;
}

function getValue(node: any): number | null {
  if (!node) return null;
  if (node.type === 'integer' || node.type === 'string') return node.value;
  return null;
}

function getCallSiteFromStack(): string | null {
  const stack = new Error().stack;
  if (!stack) return null;

  const lines = stack.split("\n");

  const callsiteLine = lines.find(line =>
    line.includes("\\services\\") ||
    line.includes("/services/") ||
    line.includes("\\controllers\\") ||
    line.includes("/controllers/") ||
    line.includes("\\libs\\")  ||
    line.includes("/libs/") ||
    line.includes("/helpers/")  ||
    line.includes("\\helpers\\")
  );

  if (!callsiteLine)
    return null;

  const regex =
    /at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?/;

  const match = callsiteLine.match(regex);
  if (!match) return null;

  const functionName = (match[1] || "anonymous").replace(/^async\s+/, "").trim();
  const fullPath = match[2];
  const line = match[3];
  const fileName = fullPath.split(/[/\\]/).pop();

  return `${functionName} (${fileName}:${line})`;

}
