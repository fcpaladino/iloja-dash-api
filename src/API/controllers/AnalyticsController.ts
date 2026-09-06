import {Request, Response} from "express";
import responseSuccess from "../responses/responseList";
import { Op } from "sequelize";
import AnalyticsEvent from "../../models/AnalyticsEvent";
import Order from "../../models/Order";
import OrderItem from "../../models/OrderItem";
import Product from "../../models/Product";
import Category from "../../models/Category";

class AnalyticsController {
  async event(req: Request, res: Response): Promise<Response> {
    const {companyId} = req.params;

    const body = req.body || {};
    const quantity = Number(body.quantity);
    const value = Number(body.totalValue ?? body.value ?? body.productPrice);

    await AnalyticsEvent.create({
      companyId: Number(companyId),
      event: String(body.event || "unknown").slice(0, 80),
      productId: body.productId ? String(body.productId) : null,
      productName: body.productName ? String(body.productName).slice(0, 255) : null,
      categoryName: body.categoryName || body.productCategory ? String(body.categoryName || body.productCategory).slice(0, 255) : null,
      quantity: Number.isFinite(quantity) ? quantity : null,
      value: Number.isFinite(value) ? value : null,
      sessionId: body.sessionId ? String(body.sessionId).slice(0, 180) : null,
      metadata: body,
    });

    return responseSuccess(res, [{ accepted: true, companyId: Number(companyId), event: body.event || "unknown" }]);
  }

  async overview(req: Request, res: Response): Promise<Response> {
    const companyId = Number((req.user as any)?.companyId);
    const requestedDays = Number(req.query.days || 30);
    const days = Math.min(365, Math.max(1, Number.isFinite(requestedDays) ? requestedDays : 30));
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [orders, products, categories, events] = await Promise.all([
      Order.findAll({ where: { companyId, createdAt: { [Op.gte]: from } }, attributes: ["id", "total", "createdAt"] }),
      Product.findAll({ where: { companyId }, attributes: ["id", "name", "categoryId"] }),
      Category.findAll({ where: { companyId }, attributes: ["id", "name"] }),
      AnalyticsEvent.findAll({ where: { companyId, createdAt: { [Op.gte]: from } }, attributes: ["event", "productId", "productName", "categoryName", "quantity", "value", "createdAt"] }),
    ]);

    const orderIds = orders.map((order) => order.id);
    const items = orderIds.length ? await OrderItem.findAll({ where: { orderId: { [Op.in]: orderIds } }, attributes: ["orderId", "productId", "productName", "quantity", "totalPrice"] }) : [];
    const productMap = new Map(products.map((product) => [String(product.id), product]));
    const categoryMap = new Map(categories.map((category) => [String(category.id), category.name]));
    const productSales = new Map<string, { productId: string; name: string; quantity: number; revenue: number }>();
    const categorySales = new Map<string, { name: string; quantity: number; revenue: number }>();

    items.forEach((item) => {
      const product = productMap.get(String(item.productId));
      const quantity = Number(item.quantity || 0);
      const revenue = Number(item.totalPrice || 0);
      const productKey = String(item.productId);
      const productCurrent = productSales.get(productKey) || { productId: productKey, name: item.productName || product?.name || "Produto", quantity: 0, revenue: 0 };
      productCurrent.quantity += quantity;
      productCurrent.revenue += revenue;
      productSales.set(productKey, productCurrent);

      const categoryName = categoryMap.get(String(product?.categoryId)) || "Sem categoria";
      const categoryCurrent = categorySales.get(categoryName) || { name: categoryName, quantity: 0, revenue: 0 };
      categoryCurrent.quantity += quantity;
      categoryCurrent.revenue += revenue;
      categorySales.set(categoryName, categoryCurrent);
    });

    const views = new Map<string, { productId: string; name: string; views: number }>();
    events.filter((event) => event.event === "product_view").forEach((event) => {
      const key = String(event.productId || event.productName || "unknown");
      const current = views.get(key) || { productId: key, name: event.productName || "Produto", views: 0 };
      current.views += 1;
      views.set(key, current);
    });

    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const eventCount = (name: string) => events.filter((event) => event.event === name).length;

    return responseSuccess(res, [{
      period: { days, from: from.toISOString() },
      kpis: { orders: orders.length, revenue, items: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0), productViews: eventCount("product_view"), categoryClicks: eventCount("category_click"), addToCart: eventCount("add_to_cart") },
      salesByCategory: [...categorySales.values()].sort((a, b) => b.revenue - a.revenue),
      topProducts: [...productSales.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 10),
      mostViewedProducts: [...views.values()].sort((a, b) => b.views - a.views).slice(0, 10),
    }]);
  }
}

export default new AnalyticsController();
