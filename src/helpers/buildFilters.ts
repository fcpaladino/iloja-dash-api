import { Op } from "sequelize";

const operatorMap = {
  "__co": Op.like,
  "__nco": Op.notLike,
  "__eq": Op.eq,
  "__neq": Op.ne,
  "__gt": Op.gt,
  "__gte": Op.gte,
  "__lt": Op.lt,
  "__lte": Op.lte,
  "__be": Op.between,
  "__nbe": Op.notBetween,
  "": Op.is, // notSet
};

export function buildFilters(query: any) {
  const and: any[] = [];
  const or: any[] = [];

  Object.keys(query).forEach((key) => {
    const val = query[key];
    if (!val || String(val) === "-1" || String(val) === "all") return;
    if (["pageSize", "page"].includes(key)) return;

    const [field, rawOp] = key.split("__");
    const operator = rawOp ? `__${rawOp}` : "";
    const op = operatorMap[operator];
    if (!op) return;

    let condition: any;

    if (operator === "__co" || operator === "__nco") {
      condition = { [field]: { [op]: `%${val}%` } };
    } else if (operator === "__be" || operator === "__nbe") {
      condition = { [field]: { [op]: String(val).split(",") } };
    } else if (operator === "") {
      condition = { [field]: { [op]: null } };
    } else {
      condition = { [field]: { [op]: val } };
    }

    // regra: __co/__nco entram no OR
    if (operator === "__co" || operator === "__nco") or.push(condition);
    else and.push(condition);
  });

  // monta WHERE final
  const where: any = {};
  if (and.length) where[Op.and] = and;
  if (or.length) where[Op.and] = [...(where[Op.and] || []), { [Op.or]: or }];

  return where;

  // const filters: any = {};
  //
  // Object.keys(query).forEach(key => {
  //   const val = query[key];
  //   if (!val || String(val) === "-1" || String(val) === "all") return;
  //
  //   if(['pageSize'].includes(key)) return;
  //
  //   const parts = key.split("__");
  //   const field = parts[0];
  //   const operator = parts.length > 1 ? `__${parts[1]}` : "";
  //
  //   const op = operatorMap[operator];
  //   if (!op) return;
  //
  //   if (!filters[field]) filters[field] = {};
  //
  //   if (operator === "__co" || operator === "__nco") {
  //     filters[field][op] = `%${val}%`;
  //   } else if (operator === "__be" || operator === "__nbe") {
  //     filters[field][op] = val.split(",");
  //   } else if (operator === "") {
  //     filters[field][op] = null;
  //   } else {
  //     filters[field][op] = val;
  //   }
  // });
  //
  // return filters;
}
