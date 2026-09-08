import {Request, Response} from "express";
import {Op} from "sequelize";
import People from "../../models/People";
import {IReqParams} from "../interfaces/reqParams";
import Company from "../../models/Company";
import PointTransaction from "../../models/PointTransaction";
import WalletTransaction from "../../models/WalletTransaction";
import {sequelize} from "../../database";

class PointsController {
  async balance(req: Request, res: Response): Promise<Response> {
    const {companyId} = req.params as unknown as IReqParams;
    const raw = String(req.query.phone || '').replace(/\D/g, '');
    const suffix = raw.slice(-8);
    if (suffix.length < 8) return res.json({data: {points: 0, walletBalance: 0}});
    const person = await People.findOne({where: {companyId, [Op.or]: [{waId: raw}, {phoneNumber: {[Op.like]: `%${suffix}`}}]}, attributes: ['point', 'walletBalance']});
    return res.json({data: {points: Number(person?.point || 0), walletBalance: Number(person?.walletBalance || 0)}});
  }

  async exchange(req: Request, res: Response): Promise<Response> {
    const {companyId} = req.params as unknown as IReqParams;
    const points = Math.floor(Number(req.body?.points || 0));
    if (points <= 0) return res.status(422).json({message: 'Informe uma quantidade válida de pontos.'});
    const company = await Company.findByPk(companyId);
    if (!company?.pointsEnabled) return res.status(422).json({message: 'O sistema de pontos está desativado.'});
    const cashValue = Number(company.pointCashValue || 0);
    if (cashValue <= 0) return res.status(422).json({message: 'A troca de pontos não está configurada.'});
    const raw = String(req.body?.phone || '').replace(/\D/g, '');
    const suffix = raw.slice(-8);
    const person = await People.findOne({where: {companyId, [Op.or]: [{waId: raw}, {phoneNumber: {[Op.like]: `%${suffix}`}}]}});
    if (!person) return res.status(404).json({message: 'Cliente não encontrado.'});
    const currentPoints = Number(person.point || 0);
    if (points > currentPoints) return res.status(422).json({message: `Pontos insuficientes. Saldo atual: ${currentPoints}.`});
    const amount = Number((points * cashValue).toFixed(2));
    const currentWallet = Number(person.walletBalance || 0);
    await sequelize.transaction(async (transaction) => {
      await person.update({point: currentPoints - points, walletBalance: currentWallet + amount}, {transaction});
      await PointTransaction.create({companyId, peopleId: person.id, type: 'EXCHANGE', points: -points, balanceBefore: currentPoints, balanceAfter: currentPoints - points, metadata: {cashValue, amount}}, {transaction});
      await WalletTransaction.create({companyId, peopleId: person.id, type: 'CREDIT', amount, balanceBefore: currentWallet, balanceAfter: currentWallet + amount, metadata: {source: 'points_exchange', points, cashValue}}, {transaction});
    });
    return res.json({data: {points: currentPoints - points, walletBalance: currentWallet + amount, amount, cashValue}});
  }
}

export default new PointsController();
