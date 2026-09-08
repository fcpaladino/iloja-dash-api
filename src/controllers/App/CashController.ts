import { Request, Response } from "express";
import { TryCatch } from "../../helpers/TryCatch";
import CashMovement from "../../models/CashMovement";

class CashController {
  @TryCatch()
  async index(req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;
    const movements = await CashMovement.findAll({ where: { companyId: user.companyId }, order: [["createdAt", "DESC"]] });
    const balance = movements.reduce((sum, item) => sum + (String(item.type).includes("WITHDRAWAL") || String(item.type).includes("EXPENSE") ? -Number(item.value) : Number(item.value)), 0);
    const entries = movements.filter((item) => !["WITHDRAWAL", "EXPENSE"].includes(item.type)).reduce((sum, item) => sum + Number(item.value), 0);
    const withdrawals = movements.filter((item) => ["WITHDRAWAL", "EXPENSE"].includes(item.type)).reduce((sum, item) => sum + Number(item.value), 0);
    return res.json({ data: { balance: Number(balance.toFixed(2)), entries: Number(entries.toFixed(2)), withdrawals: Number(withdrawals.toFixed(2)), movements } });
  }

  @TryCatch()
  async withdrawal(req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;
    const value = Number(req.body.value);
    if (!Number.isFinite(value) || value <= 0) return res.status(422).json({ message: "Informe um valor válido para o saque." });
    const movement = await CashMovement.create({ companyId: user.companyId, type: req.body.type === "EXPENSE" ? "EXPENSE" : "WITHDRAWAL", value, userId: Number(user.id), description: req.body.description || "Saque", note: req.body.note || null });
    return res.status(201).json({ data: movement });
  }
}

export default new CashController();
