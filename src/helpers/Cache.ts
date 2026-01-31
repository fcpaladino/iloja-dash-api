import { Model, ModelStatic } from "sequelize-typescript";
import { Attributes, FindOptions, BuildOptions, Identifier, WhereOptions } from "sequelize/types/model";
import { setRedis, getRedis, delRedisKeys } from "../redis";
import { UserRequest } from "./UserRequest";
import { parse } from 'pgsql-ast-parser';
import { Utils } from 'sequelize';
import crypto from 'crypto';
import { logDev } from "../utils/helpers";

const prefixCache = 'cacheDbQueryResponse';


export function generateRedisCacheKey<T extends Model>(companyId: number, model: ModelStatic<T> | string, options?: FindOptions<Attributes<T>>): string {

  try {

    let sqlRaw: string;

    if (companyId <= 0) {
      return "";
    }

    if (typeof model !== 'string') {
      sqlRaw = getSqlRaw(model, options)
    } else {
      sqlRaw = model;
    }

    const tables = extractTableNameFromSQL(sqlRaw);
    const sortedTables = NormalizeTableNameCache(tables)
    const hash = crypto.createHash('md5').update(sqlRaw).digest('hex');
    const keyName = GenerateKeyComplete(sortedTables, hash, companyId);

    return keyName;


  } catch (error) {
    // ErrorLogger.log(error);
    return '';
  }


}
export function GenerateKeyComplete(tablesNames: string, hash: string, companyIdQuery: number): string {
  const UserData = UserRequest.get();
  const companyId = companyIdQuery || UserData.companyId || 0;

  return `${prefixCache}:${companyId}:${tablesNames}:${hash}`;

}

export function NormalizeTableNameCache(tables: any[]): string {
  const sortedTables = '|' + tables
    .map((t: string) => t.toLowerCase())
    .sort()
    .join('|_|') + '|';

  return sortedTables

}


function extractSqlStatements(sql: string): {
  insert: string[],
  select: string[],
  update: string[],
  delete: string[]
} {
  sql = sql.replace(`RETURNING * INTO response`, ``);
  const extractByType = (type: string) => {
    const pattern = new RegExp(
      `${type}\\s+[^;]+;`,
      'gi'
    );
    return sql.match(pattern) || [];
  };

  return {
    insert: extractByType("INSERT"),
    select: extractByType("SELECT"),
    update: extractByType("UPDATE"),
    delete: extractByType("DELETE")
  };
}


export function extractTableNameFromSQL(sql: string) {
  try {

    if (sql.startsWith('CREATE OR REPLACE FUNCTION')) {
      const sqlStatements = extractSqlStatements(sql)
      sql = sqlStatements.insert[0] || sqlStatements.update[0] || sqlStatements.delete[0] || sqlStatements.select[0]
    }

    const parsed = parse(sql);
    const tables = new Set();

    function walk(node) {
      if (!node) return;

      // TABLE UPDATE
      if (node.table) {
        if (node.type === 'update') tables.add(node.table.name);
      }

      // TABLE INSERT
      if (node.into) {
        if (node.type === 'insert') tables.add(node.into.name);
      }

      // TABLE DELETE
      if (node.from) {
        if (node.type === 'delete') tables.add(node.from.name);
      }

      // FROM e JOINs
      if (node.from && node.type !== 'delete') {
        node.from.forEach(f => {
          if (f.type === 'table') tables.add(f.name.name);
          if (f.join) walk(f.join);
          if (f.statement) walk(f.statement);
        });
      }

      // CTEs
      if (node.with && node.with.expressions) {
        node.with.expressions.forEach(expr => walk(expr.statement));
      }

      // Subselects
      if (node.where && node.where.select) {
        walk(node.where.select);
      }

      // Recursividade para selects dentro de selects
      if (node.columns) {
        node.columns.forEach(col => {
          if (col.expr?.select) walk(col.expr.select);
        });
      }
    }


    parsed.forEach(stmt => walk(stmt));
    const tablesArray = Array.from(tables, item => String(item));
    return tablesArray;


  } catch (error) {
    // ErrorLogger.log(error);
    return [];
  }
}

export const getSqlRaw = (model: any, options: any) => {

  try {
    let sqlRaw: string;

    const scopedModel = model.scope(options.scopes || []);
    const queryOptions = {
      attributes: options.attributes,
      include: options.include,
      where: options.where,
      order: options.order,
      limit: options.limit,
      offset: options.offset,
    };

    const attributeNames = Object.keys(model._attributeManipulation);
    queryOptions.attributes = attributeNames;
    console.log(attributeNames);

    const queryGenerator = scopedModel.sequelize.queryInterface.queryGenerator;
    scopedModel._injectScope(queryOptions);


    if (queryOptions.include?.length > 0) {
      scopedModel._validateIncludedElements.bind(scopedModel)(queryOptions);
    }
    Utils.mapFinderOptions(queryOptions, scopedModel);

    sqlRaw = queryGenerator
      .selectQuery(scopedModel.getTableName(), queryOptions, scopedModel);

    return sqlRaw;

  } catch (error) {
    // ErrorLogger.log(error);
  }

}

export async function getCache(options: any, cacheKey: string): Promise<any | null> {
  if (options.UseCache) {
    const cachedData = await getRedis(cacheKey);

    const isCount = options.isCount || false;

    if (cachedData && isCount) {
      return cachedData;
    }

    if (cachedData) {
      return options.model
        ? options.model.build(cachedData, { isNewRecord: false, include: options?.include })
        : cachedData;
    }
  }
  return null;
}

export const InvalidCache = async (tableName: string, companyIdQuery: number) => {
  try {

    tableName = `|${tableName.toLowerCase()}|`;
    const UserData = UserRequest.get();
    const companyIdToken = UserData.companyId || 0;

    //INVALIDA CACHE COM BASE NA EMPRESA DO TOKEN
    await delRedisKeys(`${prefixCache}:${companyIdToken}:*${tableName}*`);
    // logDev("☢️", `INVALID_CACHE_${companyIdToken}_COMPANY_FROM_TOKEN`, tableName,)

    if (companyIdQuery == null) {
      //INVALIDA CACHE DE TODAS AS TABELAS,POIS NAO FOI INFORMADO O companyId na Sql
      // logDev("☢️", "INVALID_CACHE_ALL_COMPANY", tableName,)
      await delRedisKeys(`${prefixCache}:*:*${tableName}*`);

    } else {
      //INVALIDA CACHE COM BASE NO CAMPO companyId da Sql
      // logDev("☢️", `INVALID_CACHE_${companyIdQuery}_COMPANY`, tableName,)
      await delRedisKeys(`${prefixCache}:${companyIdQuery}:*${tableName}*`);
    }

  } catch (error) {
    // ErrorLogger.log(error);
  }



}
