import {Request, Response} from "express";
import app from "../config/app";
import {AiCreditService} from "../services/AiCreditService";
import {AiCreditOrderService} from "../services/AiCreditOrderService";
import {generateCompanySeo, generateProductDescription, generateProductSeo} from "../services/IaReportService";

const userOf = (req: Request) => req.user as IReqUser;
const runWithCredit = async (req: Request, task: string, generator: () => Promise<any>) => {
  const user = userOf(req);
  const debit = await AiCreditService.consumeOneCredit(user.companyId, Number(user.id), task);
  try { return await generator(); } catch (error) { await AiCreditService.refund(debit.id, error instanceof Error ? error.message : "Falha na geração"); throw error; }
};

export const generateProductDescriptionController = async (req: Request, res: Response) => {
  try { return res.json(await runWithCredit(req, "Descrição de produto gerada por IA", () => generateProductDescription(String(req.body.name || "")))); }
  catch (error) { return res.status(error?.statusCode || 500).json({error: error?.message || "Não foi possível gerar a descrição."}); }
};
export const generateProductSeoController = async (req: Request, res: Response) => {
  try { return res.json(await runWithCredit(req, "SEO de produto gerado por IA", () => generateProductSeo(String(req.body.name || "")))); }
  catch (error) { return res.status(error?.statusCode || 500).json({error: error?.message || "Não foi possível gerar o SEO."}); }
};
export const generateCompanySeoController = async (req: Request, res: Response) => {
  try { return res.json(await runWithCredit(req, "SEO da loja gerado por IA", () => generateCompanySeo(String(req.body.name || "")))); }
  catch (error) { return res.status(error?.statusCode || 500).json({error: error?.message || "Não foi possível gerar o SEO."}); }
};
export const getAiCreditsController = async (req: Request, res: Response) => {
  try { return res.json({data: await AiCreditService.wallet(userOf(req).companyId)}); }
  catch (error) { return res.status(error?.statusCode || 500).json({error: error?.message || "Não foi possível carregar os créditos."}); }
};
export const listAiCreditOrdersController = async (req: Request, res: Response) => {
  try { return res.json({data: {packages: AiCreditOrderService.packages(), orders: await AiCreditOrderService.list(userOf(req).companyId)}}); }
  catch (error) { return res.status(error?.statusCode || 500).json({error: error?.message || "Não foi possível carregar os pedidos."}); }
};
export const createAiCreditOrderController = async (req: Request, res: Response) => {
  try { return res.status(201).json({data: await AiCreditOrderService.create(userOf(req).companyId, Number(userOf(req).id), String(req.body.packageCode || ""))}); }
  catch (error) { return res.status(error?.statusCode || 500).json({error: error?.message || "Não foi possível comprar créditos."}); }
};
export const aiCreditsWebhookController = async (req: Request, res: Response) => {
  // O Asaas não deve receber erro HTTP nem ser levado a repetir a entrega.
  // Falhas ficam registradas para investigação, mas a resposta permanece 200.
  if (app.asaasWebhookToken && req.headers["asaas-access-token"] !== app.asaasWebhookToken) {
    console.error("Webhook Asaas recusado: token inválido.");
    return res.status(200).json({received: true});
  }
  try {
    await AiCreditOrderService.webhook(req.body);
  } catch (error) {
    console.error("Falha ao processar webhook Asaas:", error);
  }
  return res.status(200).json({received: true});
};
