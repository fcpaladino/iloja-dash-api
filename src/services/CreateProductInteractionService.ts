import {Op} from "sequelize";
import Product from "../models/Product";
import ProductInteraction, {PRODUCT_INTERACTION_EVENTS, ProductInteractionEvent} from "../models/ProductInteraction";
import ProductPreference from "../models/ProductPreference";
import AppError from "../errors/AppError";
import {invalidateRecommendationCache} from "./RecommendationCache";

export const SCORE_BY_EVENT: Record<ProductInteractionEvent, number> = {VIEW: 1, ENGAGED_VIEW: 2, INTEREST: 5, NOT_INTERESTED: -10, ADD_TO_CART: 8, PURCHASE: 15};

const isValidVisitor = (value: unknown) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));

export class CreateProductInteractionService {
  static async execute({companyId, productId, visitorId, customerId, eventType, metadata = {}}: {companyId: number; productId: number; visitorId?: string; customerId?: number; eventType: string; metadata?: Record<string, unknown>}) {
    const normalizedEvent = String(eventType || "").toUpperCase() as ProductInteractionEvent;
    if (!PRODUCT_INTERACTION_EVENTS.includes(normalizedEvent)) throw new AppError("Tipo de interação inválido.", 400);
    if (!visitorId && !customerId) throw new AppError("visitorId é obrigatório.", 400);
    if (visitorId && !isValidVisitor(visitorId)) throw new AppError("visitorId inválido.", 400);
    const product = await Product.findOne({where: {id: productId, companyId}});
    if (!product) throw new AppError("Produto não encontrado para esta loja.", 404);

    if (normalizedEvent === "VIEW") {
      const recent = await ProductInteraction.findOne({where: {companyId, productId, visitorId, eventType: "VIEW", createdAt: {[Op.gte]: new Date(Date.now() - 30 * 60 * 1000)}}});
      if (recent) return {interaction: recent, duplicate: true};
    }
    if (normalizedEvent === "ENGAGED_VIEW") {
      const recent = metadata?.sessionId
        ? await ProductInteraction.findOne({where: {companyId, productId, visitorId, eventType: "ENGAGED_VIEW", metadata: {[Op.contains]: {sessionId: String(metadata.sessionId)}}}})
        : await ProductInteraction.findOne({where: {companyId, productId, visitorId, eventType: "ENGAGED_VIEW", createdAt: {[Op.gte]: new Date(Date.now() - 30 * 60 * 1000)}}});
      if (recent) return {interaction: recent, duplicate: true};
    }

    if (normalizedEvent === "INTEREST" || normalizedEvent === "NOT_INTERESTED") {
      const current = await ProductPreference.findOne({where: {companyId, productId, ...(visitorId ? {visitorId} : {customerId})}});
      if (current?.preference === normalizedEvent) return {interaction: null, duplicate: true};
    }

    const interaction = await ProductInteraction.create({companyId, productId, visitorId: visitorId || null, customerId: customerId || null, eventType: normalizedEvent, score: SCORE_BY_EVENT[normalizedEvent], metadata});
    if (visitorId) invalidateRecommendationCache(companyId, visitorId);
    if (normalizedEvent === "INTEREST" || normalizedEvent === "NOT_INTERESTED") {
      if (visitorId) {
        await ProductPreference.upsert({companyId, productId, visitorId, customerId: customerId || null, preference: normalizedEvent});
      } else if (customerId) {
        const [current, created] = await ProductPreference.findOrCreate({where: {companyId, productId, customerId}, defaults: {companyId, productId, visitorId: null, customerId, preference: normalizedEvent}});
        if (!created) await current.update({preference: normalizedEvent});
      }
    }
    return {interaction, duplicate: false};
  }

  static async purchase({companyId, productId, visitorId, customerId, orderId, quantity}: {companyId: number; productId: number; visitorId?: string; customerId?: number; orderId?: number; quantity?: number}) {
    const product = await Product.findOne({where: {id: productId, companyId}, attributes: ["id"]});
    if (!product) return null;
    const interaction = await ProductInteraction.create({companyId, productId, visitorId: visitorId || null, customerId: customerId || null, eventType: "PURCHASE", score: SCORE_BY_EVENT.PURCHASE, metadata: {orderId, quantity}});
    if (visitorId) invalidateRecommendationCache(companyId, visitorId);
    return interaction;
  }
}
