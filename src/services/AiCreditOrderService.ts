import axios from "axios";
import app from "../config/app";
import AiCreditOrder from "../models/AiCreditOrder";
import Company from "../models/Company";
import User from "../models/User";
import CompanyAiCreditTransaction from "../models/CompanyAiCreditTransaction";
import {AiCreditService} from "./AiCreditService";
import AppError from "../errors/AppError";

export const AI_CREDIT_PACKAGES = {
  starter: {code: "starter", name: "Inicial", credits: 10, amount: 20},
  popular: {code: "popular", name: "Mais usado", credits: 50, amount: 90},
  economy: {code: "economy", name: "Melhor custo", credits: 100, amount: 170}
};

export class AiCreditOrderService {
  static packages() { return Object.values(AI_CREDIT_PACKAGES); }
  static async list(companyId: number) { return AiCreditOrder.findAll({where: {companyId}, order: [["createdAt", "DESC"]], limit: 50}); }
  static async create(companyId: number, userId: number, packageCode: string) {
    const pack = AI_CREDIT_PACKAGES[packageCode as keyof typeof AI_CREDIT_PACKAGES];
    if (!pack) throw new AppError("Pacote de créditos inválido.", 422);
    if (!app.asaasApiKey) throw new AppError("Configure a chave do Asaas para comprar créditos.", 503);
    const [company, user] = await Promise.all([Company.findByPk(companyId), User.findByPk(userId)]);
    if (!company || !user) throw new AppError("Conta não encontrada.", 404);
    const order = await AiCreditOrder.create({companyId, userId, packageCode: pack.code, credits: pack.credits, amount: pack.amount, status: "PENDING"});
    try {
      const externalReference = `AI-CREDITS-${order.id}`;
      const checkout = await axios.post(`${app.asaasApiUrl}/checkouts`, {billingTypes: ["PIX", "CREDIT_CARD"], chargeTypes: ["DETACHED"], minutesToExpire: app.asaasCheckoutExpiresMinutes, externalReference, callback: {successUrl: `${app.frontUrl}/ai-credits?payment=success`, cancelUrl: `${app.frontUrl}/ai-credits?payment=canceled`, expiredUrl: `${app.frontUrl}/ai-credits?payment=expired`}, items: [{externalReference, name: `Pacote ${pack.name}`, description: `${pack.credits} créditos de IA`, quantity: 1, value: pack.amount}]}, {headers: {access_token: app.asaasApiKey}, timeout: 30000});
      const data = checkout.data || {};
      await order.update({externalId: data.id, checkoutUrl: data.link || data.url || `https://asaas.com/checkoutSession/show/${data.id}`, payload: data});
      return order;
    } catch (error) {
      await order.update({status: "FAILED", payload: {error: error instanceof Error ? error.message : "Falha no checkout"}});
      throw new AppError("Não foi possível criar o checkout de créditos.", 502);
    }
  }

  static async webhook(body: any) {
    const checkout = body?.checkout || body?.data?.checkout || body?.data || body?.payment || {};
    const reference = checkout.externalReference || body.externalReference;
    if (!reference?.startsWith("AI-CREDITS-")) return {ignored: true};
    const order = await AiCreditOrder.findOne({where: {id: Number(reference.replace("AI-CREDITS-", ""))}});
    if (!order) return {ignored: true};
    const event = String(body.event || "");
    if (event === "CHECKOUT_PAID" && order.status !== "PAID") {
      const company = await Company.findByPk(order.companyId);
      if (!company) throw new AppError("Empresa do pedido não encontrada.", 404);
      const balanceAfter = (company.aiCredits || 0) + order.credits;
      await company.update({aiCredits: balanceAfter});
      await CompanyAiCreditTransaction.create({companyId: order.companyId, userId: order.userId, type: "credit", amount: order.credits, balanceAfter, description: `Compra de ${order.credits} créditos de IA`, metadata: {orderId: order.id, eventId: body.id}});
      await order.update({status: "PAID", payload: body});
    } else if (event === "CHECKOUT_CANCELED" && order.status !== "PAID") await order.update({status: "CANCELED", payload: body});
    else if (event === "CHECKOUT_EXPIRED" && order.status !== "PAID") await order.update({status: "EXPIRED", payload: body});
    return {order};
  }
}
