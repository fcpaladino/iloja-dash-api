import { Request, Response } from "express";
import { Op } from "sequelize";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import People from "../models/People";
import Quote from "../models/Quote";
import Company from "../models/Company";
import PeopleAddress from "../models/PeopleAddress";
import PointTransaction from "../models/PointTransaction";
import WalletTransaction from "../models/WalletTransaction";

class PortalController {
  index = async (req: Request, res: Response) => {
    const user = req.user as IReqUser;
    const company = await Company.findByPk(user.companyId, { attributes: ['customerPortalEnabled'] });
    if (!company?.customerPortalEnabled) return res.status(404).json({ message: "Painel do cliente indisponível." });
    const email = String((user as any).email || '').trim().toLowerCase();
    const phone = String((user as any).phone || '').replace(/\D/g, '');
    if (!email && !phone) return res.status(422).json({ message: "Usuário sem contato cadastrado." });
    const people = await People.findAll({ where: {
      companyId: user.companyId,
      customerPortalAccess: true,
      [Op.or]: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phoneNumber: phone }, { phoneNumber: { [Op.like]: `%${phone}%` } }] : []),
      ],
    } });
    const peopleIds = people.map((person) => person.id);
    if (!peopleIds.length) return res.json({ data: { quotes: [], orders: [], balances: { points: 0, walletBalance: 0 }, balanceHistory: [] } });
    const [quotes, orders, pointTransactions, walletTransactions, address] = await Promise.all([
      Quote.findAll({ where: { companyId: user.companyId, peopleId: { [Op.in]: peopleIds } }, order: [['createdAt', 'DESC']] }),
      Order.findAll({ where: { companyId: user.companyId, [Op.or]: [{ userId: Number(user.id) }, { peopleId: { [Op.in]: peopleIds } }] }, order: [['createdAt', 'DESC']] }),
      PointTransaction.findAll({ where: { companyId: user.companyId, peopleId: { [Op.in]: peopleIds } }, order: [['createdAt', 'DESC']], limit: 100 }),
      WalletTransaction.findAll({ where: { companyId: user.companyId, peopleId: { [Op.in]: peopleIds } }, order: [['createdAt', 'DESC']], limit: 100 }),
      PeopleAddress.findOne({ where: { peopleId: peopleIds[0] }, order: [['id', 'ASC']] }),
    ]);
    const items = orders.length ? await OrderItem.findAll({ where: { orderId: { [Op.in]: orders.map((order) => order.id) } } }) : [];
    const itemsByOrder = new Map<number, OrderItem[]>();
    items.forEach((item) => itemsByOrder.set(item.orderId, [...(itemsByOrder.get(item.orderId) || []), item]));
    const balances = people.reduce((total, person) => ({
      points: total.points + Number(person.point || 0),
      walletBalance: total.walletBalance + Number(person.walletBalance || 0),
    }), { points: 0, walletBalance: 0 });
    const balanceHistory = [
      ...pointTransactions.map((transaction) => ({
        id: `points-${transaction.id}`,
        kind: 'points',
        type: transaction.type,
        amount: Number(transaction.points || 0),
        balanceBefore: Number(transaction.balanceBefore || 0),
        balanceAfter: Number(transaction.balanceAfter || 0),
        reason: (transaction.metadata as any)?.reason || (transaction.metadata as any)?.source || 'Lançamento de pontos',
        createdAt: transaction.createdAt,
      })),
      ...walletTransactions.map((transaction) => ({
        id: `credit-${transaction.id}`,
        kind: 'credit',
        type: transaction.type,
        amount: Number(transaction.amount || 0),
        balanceBefore: Number(transaction.balanceBefore || 0),
        balanceAfter: Number(transaction.balanceAfter || 0),
        reason: (transaction.metadata as any)?.reason || (transaction.metadata as any)?.source || 'Lançamento de crédito',
        createdAt: transaction.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json({ data: {
      quotes: quotes.map((quote) => quote.toJSON()),
      orders: orders.map((order) => ({ ...order.toJSON(), items: itemsByOrder.get(order.id) || [] })),
      balances,
      balanceHistory,
      address: address?.toJSON() || null,
    } });
  };
}

export default new PortalController();
