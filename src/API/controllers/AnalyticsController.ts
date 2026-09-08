import {Request, Response} from "express";
import {QueryTypes} from "sequelize";
import responseSuccess from "../responses/responseList";
import {sequelize} from "../../database";
import AnalyticsEvent from "../../models/AnalyticsEvent";

const ALLOWED_EVENTS = new Set([
  "session_start", "page_view", "product_view", "product_share", "category_view",
  "category_click", "search", "add_to_cart", "remove_from_cart", "view_cart",
  "begin_checkout", "add_payment_info", "purchase", "whatsapp_click", "banner_view",
  "banner_click",
]);

const numberValue = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const safeMetadata = (input: unknown): Record<string, unknown> => {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const forbidden = new Set(["password", "token", "authorization", "card", "cardNumber", "cvv", "securityCode"]);
  const output: Record<string, unknown> = {};
  Object.entries(input as Record<string, unknown>).forEach(([key, value]) => {
    if (!forbidden.has(key)) output[key] = typeof value === "string" ? value.slice(0, 500) : value;
  });
  try {
    return JSON.stringify(output).length <= 8000 ? output : {};
  } catch (_) {
    return {};
  }
};

const normalizeEvent = (value: unknown): string => String(value || "").trim().toLowerCase().replace(/-/g, "_");

class AnalyticsController {
  public async event(req: Request, res: Response) {
    const event = normalizeEvent(req.body?.event);
    if (!ALLOWED_EVENTS.has(event)) {
      return responseSuccess(res, [{accepted: false, ignored: true, event}]);
    }

    const companyId = Number(req.params.companyId);
    const body = req.body || {};
    const metadata = safeMetadata(body.metadata);
    if (typeof metadata.query === "string") metadata.query = metadata.query.trim().slice(0, 120);

    const item = await AnalyticsEvent.create({
      companyId,
      event,
      deviceId: body.deviceId ? String(body.deviceId).slice(0, 180) : null,
      sessionId: body.sessionId ? String(body.sessionId).slice(0, 180) : null,
      productId: body.productId == null ? null : String(body.productId).slice(0, 120),
      productName: body.productName ? String(body.productName).slice(0, 255) : null,
      categoryId: Number.isFinite(Number(body.categoryId)) ? Number(body.categoryId) : null,
      categoryName: body.categoryName ? String(body.categoryName).slice(0, 255) : null,
      quantity: Number.isFinite(Number(body.quantity)) ? Number(body.quantity) : null,
      value: Number.isFinite(Number(body.value)) ? Number(body.value) : null,
      metadata,
    });
    return responseSuccess(res, [{accepted: true, id: item.id}]);
  }

  public async overview(req: Request, res: Response) {
    const companyId = Number((req as any).user?.companyId);
    const requestedDays = Number(req.query.days || 30);
    const days = Number.isFinite(requestedDays) ? Math.min(365, Math.max(1, Math.floor(requestedDays))) : 30;
    const to = new Date();
    const from = new Date(to.getTime() - days * 86400000);
    const replacements = {companyId, from, to};
    const eventWhere = `"companyId" = :companyId AND "createdAt" >= :from AND "createdAt" <= :to`;
    const orderWhere = `o."companyId" = :companyId AND o."createdAt" >= :from AND o."createdAt" <= :to AND o."deletedAt" IS NULL`;

    const [kpiRows, orderRows, topProducts, mostViewedProducts, salesByCategory, mostViewedCategories, mostClickedCategories, topSearches, trafficSources, devices, interestProducts, disinterestProducts, interestFunnel, eventDaily, orderDaily] = await Promise.all([
      sequelize.query(`SELECT COUNT(DISTINCT NULLIF("deviceId", '')) AS visitors, COUNT(DISTINCT NULLIF("sessionId", '')) AS sessions, COUNT(*) FILTER (WHERE event = 'page_view') AS "pageViews", COUNT(*) FILTER (WHERE event = 'product_view') AS "productViews", COUNT(*) FILTER (WHERE event = 'category_view') AS "categoryViews", COUNT(*) FILTER (WHERE event = 'category_click') AS "categoryClicks", COUNT(*) FILTER (WHERE event = 'search') AS searches, COUNT(*) FILTER (WHERE event = 'add_to_cart') AS "addToCart", COUNT(*) FILTER (WHERE event = 'begin_checkout') AS "beginCheckout" FROM "AnalyticsEvent" WHERE ${eventWhere}`, {replacements, type: QueryTypes.SELECT}),
      sequelize.query(`SELECT COUNT(*) AS orders, COALESCE(SUM(o.total), 0) AS revenue, COALESCE((SELECT SUM(oi.quantity) FROM "OrderItem" oi WHERE oi."orderId" IN (SELECT id FROM "Order" WHERE "companyId" = :companyId AND "createdAt" >= :from AND "createdAt" <= :to AND "deletedAt" IS NULL)), 0) AS "itemsSold" FROM "Order" o WHERE ${orderWhere}`, {replacements, type: QueryTypes.SELECT}),
      sequelize.query(`SELECT oi."productId", COALESCE(oi."productName", p.name, p.title) AS name, COALESCE(SUM(oi.quantity), 0) AS quantity, COALESCE(SUM(oi."totalPrice"), 0) AS revenue FROM "OrderItem" oi JOIN "Order" o ON o.id = oi."orderId" LEFT JOIN "Product" p ON p.id = oi."productId" WHERE ${orderWhere} GROUP BY oi."productId", oi."productName", p.name, p.title ORDER BY quantity DESC LIMIT 10`, {replacements, type: QueryTypes.SELECT}),
      sequelize.query(`SELECT "productId", COALESCE(MAX("productName"), 'Produto') AS name, COUNT(*) AS views FROM "AnalyticsEvent" WHERE ${eventWhere} AND event = 'product_view' AND "productId" IS NOT NULL GROUP BY "productId" ORDER BY views DESC LIMIT 10`, {replacements, type: QueryTypes.SELECT}),
      sequelize.query(`SELECT p."categoryId" AS "categoryId", COALESCE(c.name, 'Sem categoria') AS name, SUM(oi.quantity) AS quantity, SUM(oi."totalPrice") AS revenue FROM "OrderItem" oi JOIN "Order" o ON o.id = oi."orderId" JOIN "Product" p ON p.id = oi."productId" LEFT JOIN "Category" c ON c.id = p."categoryId" WHERE ${orderWhere} GROUP BY p."categoryId", c.name ORDER BY revenue DESC`, {replacements, type: QueryTypes.SELECT}),
      sequelize.query(`SELECT "categoryId", COALESCE(MAX("categoryName"), 'Categoria') AS name, COUNT(*) AS views FROM "AnalyticsEvent" WHERE ${eventWhere} AND event = 'category_view' AND "categoryId" IS NOT NULL GROUP BY "categoryId" ORDER BY views DESC LIMIT 10`, {replacements, type: QueryTypes.SELECT}),
      sequelize.query(`SELECT "categoryId", COALESCE(MAX("categoryName"), 'Categoria') AS name, COUNT(*) AS clicks FROM "AnalyticsEvent" WHERE ${eventWhere} AND event = 'category_click' AND "categoryId" IS NOT NULL GROUP BY "categoryId" ORDER BY clicks DESC LIMIT 10`, {replacements, type: QueryTypes.SELECT}),
      sequelize.query(`SELECT LOWER(TRIM(metadata->>'query')) AS query, COUNT(*) AS count FROM "AnalyticsEvent" WHERE ${eventWhere} AND event = 'search' AND LENGTH(TRIM(COALESCE(metadata->>'query', ''))) > 0 GROUP BY LOWER(TRIM(metadata->>'query')) ORDER BY count DESC LIMIT 20`, {replacements, type: QueryTypes.SELECT}),
      sequelize.query(`SELECT COALESCE(NULLIF(metadata->>'utm_source', ''), CASE WHEN LOWER(COALESCE(metadata->>'referrer', '')) LIKE '%google%' THEN 'google' WHEN LOWER(COALESCE(metadata->>'referrer', '')) LIKE '%instagram%' THEN 'instagram' WHEN COALESCE(metadata->>'referrer', '') = '' THEN 'direct' ELSE 'referral' END) AS source, COUNT(DISTINCT NULLIF("sessionId", '')) AS sessions FROM "AnalyticsEvent" WHERE ${eventWhere} AND event = 'session_start' GROUP BY source ORDER BY sessions DESC`, {replacements, type: QueryTypes.SELECT}),
      sequelize.query(`SELECT COALESCE(NULLIF(metadata->>'deviceType', ''), 'desktop') AS type, COUNT(DISTINCT NULLIF("sessionId", '')) AS sessions FROM "AnalyticsEvent" WHERE ${eventWhere} AND event = 'session_start' GROUP BY type ORDER BY sessions DESC`, {replacements, type: QueryTypes.SELECT}),
      sequelize.query(`SELECT i."productId", COALESCE(p.name, p.title, 'Produto') AS name, COUNT(*) AS interactions FROM "ProductInteraction" i JOIN "Product" p ON p.id = i."productId" AND p."companyId" = i."companyId" WHERE i."companyId" = :companyId AND i."createdAt" >= :from AND i."createdAt" <= :to AND i."eventType" = 'INTEREST' GROUP BY i."productId", p.name, p.title ORDER BY interactions DESC LIMIT 10`, {replacements, type: QueryTypes.SELECT}),
      sequelize.query(`SELECT i."productId", COALESCE(p.name, p.title, 'Produto') AS name, COUNT(*) AS interactions FROM "ProductInteraction" i JOIN "Product" p ON p.id = i."productId" AND p."companyId" = i."companyId" WHERE i."companyId" = :companyId AND i."createdAt" >= :from AND i."createdAt" <= :to AND i."eventType" = 'NOT_INTERESTED' GROUP BY i."productId", p.name, p.title ORDER BY interactions DESC LIMIT 10`, {replacements, type: QueryTypes.SELECT}),
      sequelize.query(`SELECT "eventType", COUNT(*) AS count FROM "ProductInteraction" WHERE "companyId" = :companyId AND "createdAt" >= :from AND "createdAt" <= :to GROUP BY "eventType"`, {replacements, type: QueryTypes.SELECT}),
      sequelize.query(`SELECT DATE("createdAt")::text AS date, COUNT(DISTINCT NULLIF("sessionId", '')) AS sessions, COUNT(*) FILTER (WHERE event = 'product_view') AS "productViews", COUNT(*) FILTER (WHERE event = 'add_to_cart') AS "addToCart" FROM "AnalyticsEvent" WHERE ${eventWhere} GROUP BY DATE("createdAt") ORDER BY date`, {replacements, type: QueryTypes.SELECT}),
      sequelize.query(`SELECT DATE(o."createdAt")::text AS date, COUNT(*) AS orders, COALESCE(SUM(o.total), 0) AS revenue FROM "Order" o WHERE ${orderWhere} GROUP BY DATE(o."createdAt") ORDER BY date`, {replacements, type: QueryTypes.SELECT}),
    ]);

    const k = (kpiRows[0] || {}) as any;
    const o = (orderRows[0] || {}) as any;
    const sessions = numberValue(k.sessions), productViews = numberValue(k.productViews), addToCart = numberValue(k.addToCart), beginCheckout = numberValue(k.beginCheckout), orders = numberValue(o.orders);
    const revenue = numberValue(o.revenue);
    const dailyMap = new Map<string, any>();
    for (let cursor = new Date(from); cursor <= to; cursor.setUTCDate(cursor.getUTCDate() + 1)) dailyMap.set(cursor.toISOString().slice(0, 10), {date: cursor.toISOString().slice(0, 10), sessions: 0, productViews: 0, addToCart: 0, orders: 0, revenue: 0});
    (eventDaily as any[]).forEach(row => Object.assign(dailyMap.get(row.date) || {}, {sessions: numberValue(row.sessions), productViews: numberValue(row.productViews), addToCart: numberValue(row.addToCart)}));
    (orderDaily as any[]).forEach(row => { const day = dailyMap.get(row.date); if (day) Object.assign(day, {orders: numberValue(row.orders), revenue: numberValue(row.revenue)}); });
    const percent = (value: number, base: number) => base ? Number(((value / base) * 100).toFixed(2)) : 0;
    return responseSuccess(res, [{
      period: {days, from: from.toISOString(), to: to.toISOString()},
      kpis: {visitors: numberValue(k.visitors), sessions, pageViews: numberValue(k.pageViews), productViews, categoryViews: numberValue(k.categoryViews), categoryClicks: numberValue(k.categoryClicks), searches: numberValue(k.searches), addToCart, beginCheckout, orders, itemsSold: numberValue(o.itemsSold), revenue, averageTicket: orders ? Number((revenue / orders).toFixed(2)) : 0, conversionRate: percent(orders, sessions), cartConversionRate: percent(beginCheckout, addToCart), checkoutConversionRate: percent(orders, beginCheckout)},
      funnel: {sessions, productViews, addToCart, beginCheckout, orders},
      funnelRates: {sessionToProduct: percent(productViews, sessions), productToCart: percent(addToCart, productViews), cartToCheckout: percent(beginCheckout, addToCart), checkoutToOrder: percent(orders, beginCheckout)},
      daily: Array.from(dailyMap.values()), topProducts, mostViewedProducts, salesByCategory, mostViewedCategories, mostClickedCategories, topSearches, trafficSources, devices, interestProducts, disinterestProducts, interestFunnel,
      definitions: {cartConversionRate: "beginCheckout / addToCart * 100", checkoutConversionRate: "orders / beginCheckout * 100", ordersAndRevenue: "calculados pelas tabelas Order e OrderItem"},
    }]);
  }
}

export default new AnalyticsController();
