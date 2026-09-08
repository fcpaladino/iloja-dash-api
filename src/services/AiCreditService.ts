import {Op} from "sequelize";
import {sequelize} from "../database";
import Company from "../models/Company";
import CompanyAiCreditTransaction from "../models/CompanyAiCreditTransaction";
import AppError from "../errors/AppError";

export class AiCreditService {
  static async consumeOneCredit(companyId: number, userId: number, description: string) {
    return sequelize.transaction(async transaction => {
      const company = await Company.findByPk(companyId, {transaction, lock: transaction.LOCK.UPDATE});
      if (!company) throw new AppError("Empresa não encontrada.", 404);
      if ((company.aiCredits || 0) < 1) throw new AppError("Saldo de créditos insuficiente para gerar com IA.", 402);
      const balanceAfter = company.aiCredits - 1;
      await company.update({aiCredits: balanceAfter}, {transaction});
      const entry = await CompanyAiCreditTransaction.create({companyId, userId, type: "debit", amount: -1, balanceAfter, description}, {transaction});
      return entry;
    });
  }

  static async refund(entryId: number, reason: string) {
    return sequelize.transaction(async transaction => {
      const debit = await CompanyAiCreditTransaction.findByPk(entryId, {transaction, lock: transaction.LOCK.UPDATE});
      if (!debit || debit.type !== "debit") return false;
      const existing = await CompanyAiCreditTransaction.findOne({where: {type: "refund", metadata: {[Op.contains]: {refundOfTransactionId: String(entryId)}}}, transaction});
      if (existing) return false;
      const company = await Company.findByPk(debit.companyId, {transaction, lock: transaction.LOCK.UPDATE});
      if (!company) return false;
      const balanceAfter = (company.aiCredits || 0) + 1;
      await company.update({aiCredits: balanceAfter}, {transaction});
      await CompanyAiCreditTransaction.create({companyId: debit.companyId, userId: debit.userId, type: "refund", amount: 1, balanceAfter, description: "Estorno de geração com IA", metadata: {refundOfTransactionId: String(entryId), reason}}, {transaction});
      return true;
    });
  }

  static async wallet(companyId: number) {
    const company = await Company.findByPk(companyId, {attributes: ["id", "aiCredits"]});
    if (!company) throw new AppError("Empresa não encontrada.", 404);
    const transactions = await CompanyAiCreditTransaction.findAll({where: {companyId}, order: [["createdAt", "DESC"]], limit: 100});
    return {balance: company.aiCredits || 0, transactions};
  }
}
