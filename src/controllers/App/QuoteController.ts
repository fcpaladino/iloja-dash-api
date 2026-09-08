import { Request, Response } from "express";
import { Op } from "sequelize";
import Quote from "../../models/Quote";
import People from "../../models/People";
import sendEmail from "../../utils/sendEmail";

const STATUS = ["DRAFT", "SENT", "APPROVED", "REJECTED", "EXPIRED"];

const money = (value: unknown) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function userCompanyId(req: Request) {
  return Number((req.user as IReqUser).companyId);
}

function quotePayload(quote: Quote, people?: People | null) {
  return {
    ...quote.toJSON(),
    customer: people ? { id: people.id, name: people.tradeName || people.legalName, email: people.email, phone: people.phoneNumber } : null,
  };
}

function emailHtml(quote: Quote, people: People) {
  const items = Array.isArray(quote.items) ? quote.items : [];
  return `<div style="font-family:Arial,sans-serif;color:#18212f;max-width:640px;margin:auto">
    <h2>Orçamento #${quote.id}</h2>
    <p>Olá, ${people.tradeName || people.legalName || "cliente"}.</p>
    <p>Seu orçamento está disponível e é válido até <strong>${quote.validUntil ? new Date(quote.validUntil).toLocaleDateString("pt-BR") : "a confirmação"}</strong>.</p>
    <table style="width:100%;border-collapse:collapse"><tbody>${items.map((item: any) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${item.name || item.productName || "Item"} x${item.quantity || 1}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${money(item.totalPrice || ((item.quantity || 1) * (item.unitPrice || item.price || 0)))}</td></tr>`).join("")}</tbody></table>
    <p style="font-size:18px;text-align:right"><strong>Total: ${money(quote.total)}</strong></p>
    ${quote.note ? `<p>Observações: ${quote.note}</p>` : ""}
  </div>`;
}

class QuoteController {
  index = async (req: Request, res: Response) => {
    const companyId = userCompanyId(req);
    const where: any = { companyId };
    if (req.query.status) where.status = String(req.query.status).toUpperCase();
    const quotes = await Quote.findAll({ where, order: [["createdAt", "DESC"]], limit: 100 });
    const peopleIds = quotes.map((quote) => quote.peopleId).filter(Boolean);
    const people = peopleIds.length ? await People.findAll({ where: { id: { [Op.in]: peopleIds } } }) : [];
    const byId = new Map(people.map((person) => [person.id, person]));
    return res.json({ data: quotes.map((quote) => quotePayload(quote, byId.get(quote.peopleId))) });
  };

  store = async (req: Request, res: Response) => {
    const companyId = userCompanyId(req);
    const body = req.body || {};
    const customer = body.customer || body.people || {};
    if (!customer.email) return res.status(422).json({ message: "O e-mail do cliente é obrigatório." });
    const [people] = await People.findOrCreate({
      where: { companyId, email: String(customer.email).trim().toLowerCase() },
      defaults: { companyId, email: String(customer.email).trim().toLowerCase(), legalName: customer.name || "Cliente", phoneNumber: customer.phone || null },
    });
    const items = Array.isArray(body.items) ? body.items : [];
    const subtotal = Number(body.subtotal ?? items.reduce((sum: number, item: any) => sum + Number(item.totalPrice || (item.quantity || 1) * (item.unitPrice || item.price || 0)), 0));
    const discountValue = Number(body.discountValue || 0);
    const quote = await Quote.create({ companyId, peopleId: people.id, status: "DRAFT", subtotal, discountValue, total: Number(body.total ?? subtotal - discountValue), validUntil: body.validUntil || null, note: body.note || null, items });
    if (body.sendEmail !== false) await this.send(quote, people);
    return res.status(201).json({ data: quotePayload(quote, people) });
  };

  update = async (req: Request, res: Response) => {
    const quote = await Quote.findOne({ where: { id: req.params.id, companyId: userCompanyId(req) } });
    if (!quote) return res.status(404).json({ message: "Orçamento não encontrado." });
    const nextStatus = String(req.body.status || quote.status).toUpperCase();
    if (!STATUS.includes(nextStatus)) return res.status(422).json({ message: "Status de orçamento inválido." });
    await quote.update({ status: nextStatus, ...(req.body.validUntil !== undefined ? { validUntil: req.body.validUntil } : {}) });
    if (nextStatus === "SENT") {
      const people = await People.findByPk(quote.peopleId);
      if (people) await this.send(quote, people);
    }
    return res.json({ data: quotePayload(quote, await People.findByPk(quote.peopleId)) });
  };

  send = async (quote: Quote, people: People) => {
    if (!people.email || !process.env.SMTP_HOST) return false;
    const result = await sendEmail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to: people.email, subject: `Orçamento #${quote.id}`, html: emailHtml(quote, people) });
    if (!result) return false;
    await quote.update({ status: "SENT", emailSentAt: new Date() });
    return true;
  };
}

export default new QuoteController();
