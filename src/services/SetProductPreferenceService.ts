import Product from "../models/Product";
import ProductPreference from "../models/ProductPreference";
import {CreateProductInteractionService} from "./CreateProductInteractionService";
import AppError from "../errors/AppError";

export class SetProductPreferenceService {
  static async execute({companyId, productId, visitorId, customerId, preference}: {companyId: number; productId: number; visitorId?: string; customerId?: number; preference: string}) {
    const normalized = String(preference || "").toUpperCase();
    if (normalized !== "INTEREST" && normalized !== "NOT_INTERESTED") throw new AppError("Preferência inválida.", 400);
    const product = await Product.findOne({where: {id: productId, companyId}, attributes: ["id"]});
    if (!product) throw new AppError("Produto não encontrado para esta loja.", 404);
    const result = await CreateProductInteractionService.execute({companyId, productId, visitorId, customerId, eventType: normalized, metadata: {source: "product_interest"}});
    return {preference: normalized, interaction: result.interaction};
  }
  static async get(companyId: number, productId: number, visitorId: string) {
    return ProductPreference.findOne({where: {companyId, productId, visitorId}, attributes: ["preference"]});
  }
}
