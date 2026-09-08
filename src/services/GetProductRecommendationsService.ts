import {QueryTypes} from "sequelize";
import {sequelize} from "../database";
import ProductInteraction from "../models/ProductInteraction";
import {recommendationCacheStore, RECOMMENDATION_CACHE_TTL_MS} from "./RecommendationCache";

const fallbackSql = `SELECT p.*, (COALESCE(s.purchases, 0) * 3 + COALESCE(a.additions, 0) * 2 + COALESCE(v.views, 0)) AS "recommendationScore"
FROM "Product" p
LEFT JOIN (SELECT "productId", COUNT(*) purchases FROM "ProductInteraction" WHERE "companyId" = :companyId AND "eventType" = 'PURCHASE' GROUP BY "productId") s ON s."productId" = p.id
LEFT JOIN (SELECT "productId", COUNT(*) additions FROM "ProductInteraction" WHERE "companyId" = :companyId AND "eventType" = 'ADD_TO_CART' GROUP BY "productId") a ON a."productId" = p.id
LEFT JOIN (SELECT "productId", COUNT(*) views FROM "ProductInteraction" WHERE "companyId" = :companyId AND "eventType" = 'VIEW' GROUP BY "productId") v ON v."productId" = p.id
WHERE p."companyId" = :companyId AND p."active" IS DISTINCT FROM FALSE AND p."availability" IS DISTINCT FROM FALSE
AND NOT EXISTS (SELECT 1 FROM "ProductPreference" pp WHERE pp."companyId" = p."companyId" AND pp."productId" = p.id AND pp."visitorId" = :visitorId AND pp."preference" = 'NOT_INTERESTED')
ORDER BY "recommendationScore" DESC, p."createdAt" DESC LIMIT :limit`;

const personalizedSql = `WITH signals AS (
  SELECT i."productId", p."categoryId", p."groupId", p."subGroupId", p."brandId", i.score
  FROM "ProductInteraction" i JOIN "Product" p ON p.id = i."productId" AND p."companyId" = i."companyId"
  WHERE i."companyId" = :companyId AND i."visitorId" = :visitorId
), feature_scores AS (
  SELECT 'category' kind, "categoryId"::text value, SUM(score) score FROM signals WHERE "categoryId" IS NOT NULL GROUP BY "categoryId"
  UNION ALL SELECT 'group', "groupId"::text, SUM(score) FROM signals WHERE "groupId" IS NOT NULL GROUP BY "groupId"
  UNION ALL SELECT 'subgroup', "subGroupId"::text, SUM(score) FROM signals WHERE "subGroupId" IS NOT NULL GROUP BY "subGroupId"
  UNION ALL SELECT 'brand', "brandId"::text, SUM(score) FROM signals WHERE "brandId" IS NOT NULL GROUP BY "brandId"
  UNION ALL SELECT 'tag', pt."tagId"::text, SUM(s.score) FROM signals s JOIN "ProductTag" pt ON pt."productId" = s."productId" GROUP BY pt."tagId"
  UNION ALL SELECT 'filter', pfi."filterItemId"::text, SUM(s.score) FROM signals s JOIN "ProductFilterItem" pfi ON pfi."productId" = s."productId" GROUP BY pfi."filterItemId"
)
SELECT candidate.*, (
  COALESCE((SELECT score FROM feature_scores WHERE kind = 'category' AND value = candidate."categoryId"::text), 0) * 1
  + COALESCE((SELECT score FROM feature_scores WHERE kind = 'group' AND value = candidate."groupId"::text), 0) * 1.2
  + COALESCE((SELECT score FROM feature_scores WHERE kind = 'subgroup' AND value = candidate."subGroupId"::text), 0) * 1.5
  + COALESCE((SELECT score FROM feature_scores WHERE kind = 'brand' AND value = candidate."brandId"::text), 0) * 1
  + COALESCE((SELECT SUM(fs.score) FROM "ProductTag" pt JOIN feature_scores fs ON fs.kind = 'tag' AND fs.value = pt."tagId"::text WHERE pt."productId" = candidate.id), 0) * 1.3
  + COALESCE((SELECT SUM(fs.score) FROM "ProductFilterItem" pfi JOIN feature_scores fs ON fs.kind = 'filter' AND fs.value = pfi."filterItemId"::text WHERE pfi."productId" = candidate.id), 0) * 1.1
) AS "recommendationScore"
FROM "Product" candidate
WHERE candidate."companyId" = :companyId AND candidate."active" IS DISTINCT FROM FALSE AND candidate."availability" IS DISTINCT FROM FALSE
AND NOT EXISTS (SELECT 1 FROM "ProductPreference" pp WHERE pp."companyId" = candidate."companyId" AND pp."productId" = candidate.id AND pp."visitorId" = :visitorId AND pp."preference" = 'NOT_INTERESTED')
ORDER BY "recommendationScore" DESC, candidate."createdAt" DESC LIMIT :limit`;

export class GetProductRecommendationsService {
  static async execute(companyId: number, visitorId: string, limit = 12) {
    const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 50);
    const cacheKey = `${companyId}:${visitorId}:${safeLimit}`;
    const cached = recommendationCacheStore.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return cached.products;
    recommendationCacheStore.delete(cacheKey);
    const hasSignals = await ProductInteraction.findOne({where: {companyId, visitorId}, attributes: ["id"]});
    const rows = await sequelize.query(hasSignals ? personalizedSql : fallbackSql, {replacements: {companyId, visitorId, limit: safeLimit}, type: QueryTypes.SELECT});
    const products = rows.map((row: any) => ({
      ...row,
      image: row.image && !/^https?:\/\//i.test(row.image)
        ? `${process.env.BACKEND_URL}/${String(row.image).replace(/^\//, "")}`
        : row.image,
      price: row.pricePromotional ?? row.price,
      oldPrice: row.pricePromotional ? row.price : row.oldPrice,
    }));
    recommendationCacheStore.set(cacheKey, {expiresAt: Date.now() + RECOMMENDATION_CACHE_TTL_MS, products});
    return products;
  }
}
