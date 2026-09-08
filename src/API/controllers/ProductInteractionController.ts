import {Request, Response} from "express";
import {HandlerError} from "../helpers/HandleErrors";
import ProductInteraction, {PRODUCT_INTERACTION_EVENTS} from "../../models/ProductInteraction";
import {CreateProductInteractionService} from "../../services/CreateProductInteractionService";
import {SetProductPreferenceService} from "../../services/SetProductPreferenceService";
import {GetProductRecommendationsService} from "../../services/GetProductRecommendationsService";

const companyIdOf = (req: Request) => Number(req.params.companyId);
const visitorIdOf = (req: Request) => String(req.body?.visitorId || req.headers["x-visitor-id"] || "");

class ProductInteractionController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const body = req.body || {};
      const eventType = String(body.eventType || "").toUpperCase();
      if (!body.productId || !eventType || !PRODUCT_INTERACTION_EVENTS.includes(eventType as any)) return res.status(400).json({message: "productId e eventType válidos são obrigatórios."});
      if (eventType === "PURCHASE") return res.status(400).json({message: "PURCHASE é registrado exclusivamente pelo backend do pedido."});
      const result = await CreateProductInteractionService.execute({companyId: companyIdOf(req), productId: Number(body.productId), visitorId: visitorIdOf(req) || undefined, customerId: body.customerId ? Number(body.customerId) : undefined, eventType: body.eventType, metadata: body.metadata && typeof body.metadata === "object" ? body.metadata : {}});
      return res.json({data: {id: result.interaction?.id || null, duplicate: result.duplicate}});
    } catch (error) { return HandlerError(res, error, "Api.ProductInteraction.create"); }
  }

  async preference(req: Request, res: Response): Promise<Response> {
    try { const item = await SetProductPreferenceService.get(companyIdOf(req), Number(req.params.productId), String(req.headers["x-visitor-id"] || "")); return res.json({preference: item?.preference || null}); }
    catch (error) { return HandlerError(res, error, "Api.ProductPreference.get"); }
  }

  async setPreference(req: Request, res: Response): Promise<Response> {
    try { const result = await SetProductPreferenceService.execute({companyId: companyIdOf(req), productId: Number(req.params.productId), visitorId: visitorIdOf(req), customerId: req.body?.customerId ? Number(req.body.customerId) : undefined, preference: req.body?.preference}); return res.json({data: {preference: result.preference}}); }
    catch (error) { return HandlerError(res, error, "Api.ProductPreference.set"); }
  }

  async recommended(req: Request, res: Response): Promise<Response> {
    try { const visitorId = String(req.headers["x-visitor-id"] || req.query.visitorId || ""); if (!visitorId) return res.json({data: []}); const products = await GetProductRecommendationsService.execute(companyIdOf(req), visitorId, Number(req.query.limit)); return res.json({data: products}); }
    catch (error) { return HandlerError(res, error, "Api.ProductRecommendation.list"); }
  }
}

export default new ProductInteractionController();
