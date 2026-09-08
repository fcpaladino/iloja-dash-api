import { Request, Response } from "express";
import { Op } from "sequelize";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import People from "../models/People";
import Quote from "../models/Quote";
import Company from "../models/Company";

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
    if (!peopleIds.length) return res.json({ data: { quotes: [], orders: [] } });
    const [quotes, orders] = await Promise.all([
      Quote.findAll({ where: { companyId: user.companyId, peopleId: { [Op.in]: peopleIds } }, order: [['createdAt', 'DESC']] }),
      Order.findAll({ where: { companyId: user.companyId, [Op.or]: [{ userId: Number(user.id) }, { peopleId: { [Op.in]: peopleIds } }] }, order: [['createdAt', 'DESC']] }),
    ]);
    const items = orders.length ? await OrderItem.findAll({ where: { orderId: { [Op.in]: orders.map((order) => order.id) } } }) : [];
    const itemsByOrder = new Map<number, OrderItem[]>();
    items.forEach((item) => itemsByOrder.set(item.orderId, [...(itemsByOrder.get(item.orderId) || []), item]));
    return res.json({ data: {
      quotes: quotes.map((quote) => quote.toJSON()),
      orders: orders.map((order) => ({ ...order.toJSON(), items: itemsByOrder.get(order.id) || [] })),
    } });
  };
}

export default new PortalController();
