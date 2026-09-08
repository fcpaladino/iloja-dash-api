import { Request, Response } from "express";
import { Op } from "sequelize";
import { TryCatch } from "../../helpers/TryCatch";
import { HandlerError } from "../../errors/HandlerError";
import { responseSuccess } from "../../helpers/response";
import People from "../../models/People";
import ReceivableAccount from "../../models/ReceivableAccount";
import ReceivableInstallment from "../../models/ReceivableInstallment";
import CashMovement from "../../models/CashMovement";
import Order from "../../models/Order";

const accountStatus = (total: number, paid: number) => paid >= total ? "PAID" : paid > 0 ? "PARTIAL" : "OPEN";
const asDate = (value: unknown) => { const date = new Date(String(value)); return Number.isNaN(date.getTime()) ? null : date; };

class ReceivableController {
  constructor() { this.index = this.index.bind(this); this.show = this.show.bind(this); this.store = this.store.bind(this); this.pay = this.pay.bind(this); }

  @TryCatch()
  async index(req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;
    const accounts = await ReceivableAccount.findAll({ where: { companyId: user.companyId }, order: [["createdAt", "DESC"]] });
    const people = accounts.length ? await People.findAll({ where: { id: { [Op.in]: accounts.map((item) => item.peopleId) } } }) : [];
    const installments = accounts.length ? await ReceivableInstallment.findAll({ where: { accountId: { [Op.in]: accounts.map((item) => item.id) } }, order: [["dueDate", "ASC"]] }) : [];
    const peopleById = new Map(people.map((item) => [item.id, item]));
    const installmentsByAccount = new Map<number, ReceivableInstallment[]>();
    installments.forEach((item) => installmentsByAccount.set(item.accountId, [...(installmentsByAccount.get(item.accountId) || []), item]));
    const now = new Date();
    return res.json({ data: accounts.map((account) => {
      const rows = installmentsByAccount.get(account.id) || [];
      const due = rows.some((item) => item.status !== "PAID" && new Date(item.dueDate) < now);
      return { ...account.toJSON(), status: account.status === "PAID" ? "PAID" : due ? "OVERDUE" : account.status, customerName: peopleById.get(account.peopleId)?.tradeName || peopleById.get(account.peopleId)?.legalName || "Cliente", installments: rows };
    }) });
  }

  @TryCatch()
  async show(req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;
    const account = await ReceivableAccount.findOne({ where: { id: req.params.id, companyId: user.companyId } });
    if (!account) return res.status(404).json({ message: "Conta a receber não encontrada." });
    const [person, installments] = await Promise.all([People.findByPk(account.peopleId), ReceivableInstallment.findAll({ where: { accountId: account.id }, order: [["number", "ASC"]] })]);
    return res.json(responseSuccess({ ...account.toJSON(), customer: person, installments }));
  }

  @TryCatch()
  async store(req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;
    const data = req.body || {};
    const total = Number(data.totalValue);
    const count = Math.max(1, Number(data.installments || 1));
    const person = await People.findOne({ where: { id: data.peopleId, companyId: user.companyId } });
    if (!person) return res.status(422).json({ message: "Cliente inválido." });
    if (!Number.isFinite(total) || total <= 0) return res.status(422).json({ message: "Informe um valor válido." });
    const firstDueDate = asDate(data.firstDueDate || new Date());
    if (!firstDueDate) return res.status(422).json({ message: "Informe uma data de vencimento válida." });
    const account = await ReceivableAccount.create({ companyId: user.companyId, peopleId: person.id, orderId: data.orderId || null, description: data.description || "Venda a prazo", totalValue: total, paidValue: 0, status: "OPEN", note: data.note || null });
    const base = Math.floor((total / count) * 100) / 100;
    const rows = Array.from({ length: count }, (_, index) => {
      const dueDate = new Date(firstDueDate);
      dueDate.setMonth(dueDate.getMonth() + index);
      return { accountId: account.id, number: index + 1, value: index === count - 1 ? Number((total - base * (count - 1)).toFixed(2)) : base, dueDate, paidValue: 0, status: "OPEN" };
    });
    await ReceivableInstallment.bulkCreate(rows);
    if (data.orderId) await Order.update({ paymentStatusId: 1 }, { where: { id: data.orderId, companyId: user.companyId } });
    return res.status(201).json(responseSuccess({ ...account.toJSON(), installments: await ReceivableInstallment.findAll({ where: { accountId: account.id }, order: [["number", "ASC"]] }) }));
  }

  @TryCatch()
  async pay(req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;
    const account = await ReceivableAccount.findOne({ where: { id: req.params.id, companyId: user.companyId } });
    if (!account) return res.status(404).json({ message: "Conta a receber não encontrada." });
    const installment = await ReceivableInstallment.findOne({ where: { id: req.body.installmentId, accountId: account.id } });
    if (!installment) return res.status(404).json({ message: "Parcela não encontrada." });
    const amount = Number(req.body.value ?? Number(installment.value) - Number(installment.paidValue));
    const remaining = Number(installment.value) - Number(installment.paidValue);
    if (!Number.isFinite(amount) || amount <= 0 || amount > remaining + 0.01) return res.status(422).json({ message: "Valor de recebimento inválido." });
    const paid = Number((Number(installment.paidValue) + amount).toFixed(2));
    await installment.update({ paidValue: paid, status: paid >= Number(installment.value) ? "PAID" : "PARTIAL", paidAt: paid >= Number(installment.value) ? new Date() : null, paymentMethodId: req.body.paymentMethodId || null, note: req.body.note || installment.note });
    const all = await ReceivableInstallment.findAll({ where: { accountId: account.id } });
    const totalPaid = Number(all.reduce((sum, row) => sum + Number(row.paidValue), 0).toFixed(2));
    await account.update({ paidValue: totalPaid, status: accountStatus(Number(account.totalValue), totalPaid) });
    await CashMovement.create({ companyId: user.companyId, type: "RECEIVABLE_PAYMENT", value: amount, userId: Number(user.id), orderId: account.orderId || null, installmentId: installment.id, description: `Recebimento - ${account.description}` });
    if (account.orderId) await Order.update({ paymentStatusId: account.status === "PAID" ? 2 : 1 }, { where: { id: account.orderId, companyId: user.companyId } });
    return res.json(responseSuccess({ account, installment }));
  }
}

export default new ReceivableController();
