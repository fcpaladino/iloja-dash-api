import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { TryCatch } from '../../helpers/TryCatch';
import { HandlerError } from '../../errors/HandlerError';
import { responseSuccess } from '../../helpers/response';
import Order from '../../models/Order';
import OrderItem from '../../models/OrderItem';
import OrderStatus from '../../models/OrderStatus';
import People from '../../models/People';
import {CreateProductInteractionService} from '../../services/CreateProductInteractionService';
import CashMovement from '../../models/CashMovement';
import ReceivableAccount from '../../models/ReceivableAccount';
import ReceivableInstallment from '../../models/ReceivableInstallment';

const STATUS = {
  1: { key: 'RECEBIDO', label: 'Pedido recebido' },
  2: { key: 'CONFIRMADO', label: 'Pedido confirmado' },
  3: { key: 'PREPARANDO', label: 'Preparando' },
  4: { key: 'ENTREGA', label: 'Saiu para entrega' },
  5: { key: 'FINALIZADO', label: 'Finalizado' },
} as const;

function statusFromId(statusId: number | null | undefined) {
  return STATUS[Number(statusId) as keyof typeof STATUS] || STATUS[1];
}

function statusIdFromValue(value: unknown) {
  const normalized = String(value || '').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (normalized.includes('CONFIRM')) return 2;
  if (normalized.includes('PREPAR')) return 3;
  if (normalized.includes('ENTREG') || normalized.includes('DELIVERY') || normalized.includes('SHIPPING')) return 4;
  if (normalized.includes('FINAL') || normalized.includes('COMPLETE')) return 5;
  return 1;
}

function presentOrder(order: Order, people?: People | null, items: OrderItem[] = []) {
  const status = statusFromId(order.statusId);
  return {
    ...order.toJSON(), code: order.id, status: status.key, statusCode: status.key,
    orderStatus: status.key, statusLabel: status.label,
    customerName: people?.tradeName || people?.legalName || 'Cliente não informado',
    customer: people ? { name: people.tradeName || people.legalName, phone: people.phoneNumber, document: people.documentNumber } : undefined,
    paymentStatus: Number(order.paymentStatusId) === 2 ? 'PAID' : Number(order.paymentStatusId) === 3 ? 'PARTIAL' : 'PENDING',
    items: items.map((item) => item.toJSON()),
    itemCount: items.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
  };
}

class OrderController {
  constructor() { this.index = this.index.bind(this); this.show = this.show.bind(this); this.update = this.update.bind(this); this.markPaid = this.markPaid.bind(this); this.installments = this.installments.bind(this); }

  @TryCatch()
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const orders = await Order.findAll({ where: { companyId: user.companyId }, order: [['createdAt', 'DESC']] });
      const peopleIds = [...new Set(orders.map((order) => order.peopleId))];
      const people = peopleIds.length ? await People.findAll({ where: { id: { [Op.in]: peopleIds } } }) : [];
      const items = orders.length ? await OrderItem.findAll({ where: { orderId: { [Op.in]: orders.map((order) => order.id) } } }) : [];
      const peopleById = new Map(people.map((person) => [person.id, person]));
      const itemsByOrder = new Map<number, OrderItem[]>();
      items.forEach((item) => itemsByOrder.set(item.orderId, [...(itemsByOrder.get(item.orderId) || []), item]));
      return res.json({ data: orders.map((order) => presentOrder(order, peopleById.get(order.peopleId), itemsByOrder.get(order.id) || [])) });
    } catch (error) { return HandlerError(error, res); }
  }

  @TryCatch()
  async show(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const order = await Order.findOne({ where: { id: req.params.id, companyId: user.companyId } });
      if (!order) return res.status(404).json({ message: 'Pedido não encontrado.' });
      const [people, items] = await Promise.all([People.findByPk(order.peopleId), OrderItem.findAll({ where: { orderId: order.id }, order: [['id', 'ASC']] })]);
      return res.json(responseSuccess({ ...presentOrder(order, people, items) }));
    } catch (error) { return HandlerError(error, res); }
  }

  @TryCatch()
  async update(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const order = await Order.findOne({ where: { id: req.params.id, companyId: user.companyId } });
      if (!order) return res.status(404).json({ message: 'Pedido não encontrado.' });
      const nextStatus = req.body.status || req.body.statusCode || req.body.orderStatus || req.body.state;
      if (nextStatus !== undefined) {
        const statusId = statusIdFromValue(nextStatus);
        await order.update({ statusId });
        await OrderStatus.create({ orderId: order.id, statusId, userId: Number(user.id), note: 'Status atualizado' });
      }
      if (req.body.paymentStatusId !== undefined) await order.update({ paymentStatusId: Number(req.body.paymentStatusId) });
      const status = statusFromId(order.statusId);
      return res.json(responseSuccess({ ...order.toJSON(), code: order.id, status: status.key, statusLabel: status.label }));
    } catch (error) { return HandlerError(error, res); }
  }

  @TryCatch()
  async markPaid(req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;
    const order = await Order.findOne({ where: { id: req.params.id, companyId: user.companyId } });
    if (!order) return res.status(404).json({ message: 'Pedido não encontrado.' });
    if (Number(order.paymentStatusId) !== 2) {
      await order.update({ paymentStatusId: 2 });
      const existing = await CashMovement.findOne({ where: { companyId: user.companyId, orderId: order.id, type: 'SALE_RECEIPT' } });
      if (!existing) await CashMovement.create({ companyId: user.companyId, type: 'SALE_RECEIPT', value: Number(order.total), userId: Number(user.id), orderId: order.id, description: `Pagamento do pedido #${order.id}` });
    }
    return res.json(responseSuccess({ ...order.toJSON(), paymentStatus: 'PAID' }));
  }

  @TryCatch()
  async installments(req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;
    const order = await Order.findOne({ where: { id: req.params.id, companyId: user.companyId } });
    if (!order) return res.status(404).json({ message: 'Pedido não encontrado.' });
    const count = Math.max(1, Number(req.body.installments || 1));
    const firstDue = new Date(String(req.body.firstDueDate || new Date()));
    if (!Number.isFinite(firstDue.getTime())) return res.status(422).json({ message: 'Data de vencimento inválida.' });
    const account = await ReceivableAccount.create({ companyId: user.companyId, peopleId: order.peopleId, orderId: order.id, description: `Pedido #${order.id}`, totalValue: Number(order.total), paidValue: 0, status: 'OPEN' });
    const base = Math.floor((Number(order.total) / count) * 100) / 100;
    await ReceivableInstallment.bulkCreate(Array.from({ length: count }, (_, index) => { const dueDate = new Date(firstDue); dueDate.setMonth(dueDate.getMonth() + index); return { accountId: account.id, number: index + 1, value: index === count - 1 ? Number((Number(order.total) - base * (count - 1)).toFixed(2)) : base, dueDate, paidValue: 0, status: 'OPEN' }; }));
    await order.update({ paymentStatusId: 1 });
    return res.status(201).json(responseSuccess({ account, installments: await ReceivableInstallment.findAll({ where: { accountId: account.id }, order: [['number', 'ASC']] }) }));
  }

  async lists(req: Request, res: Response): Promise<Response> { return this.index(req, res); }

  @TryCatch()
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const data = req.body || {};
      const client = data.people || data.client || {};
      const isPdvAnonymous = String(client.name || '').trim().toUpperCase() === 'PDV';
      const phone = String(isPdvAnonymous ? '1100000000' : (client.whatsapp || client.phoneNumber || client.phone || '')).replace(/\D/g, '');
      const waId = phone || `pdv-${user.companyId}-${Date.now()}`;
      const [person] = await People.findOrCreate({
        where: { companyId: user.companyId, waId },
        defaults: { companyId: user.companyId, waId, legalName: isPdvAnonymous ? 'PDV' : (client.name || 'Consumidor final'), phoneNumber: phone },
      });
      if (client.name && person.legalName !== client.name) await person.update({ legalName: client.name, phoneNumber: phone || person.phoneNumber });

      const items = Array.isArray(data.items) ? data.items : [];
      const subtotal = Number(data.subtotal ?? items.reduce((sum: number, item: any) => sum + Number(item.totalPrice || (item.quantity || 1) * item.unitPrice || 0), 0));
      const shippingValue = Number(data.shippingValue || 0);
      const discountValue = Number(data.discountValue || 0);
      const total = Number(data.total ?? subtotal + shippingValue - discountValue);
      const order = await Order.create({ userId: Number(user.id), companyId: user.companyId, peopleId: person.id, paymentMethodId: data.paymentMethodId || null, deliveryTypeId: data.deliveryTypeId || null, statusId: 1, subtotal, shippingValue, discountValue, total, address: data.address || null, note: data.note || null, pointGenerated: data.generatePoints ? Math.floor(total) : 0 });
      await Promise.all(items.map((item: any) => OrderItem.create({ orderId: order.id, productId: item.productId || item.id, productName: item.productName || item.name, productRef: item.productRef || item.ref || String(item.productId || item.id), quantity: Number(item.quantity || item.qty || 1), unitPrice: Number(item.unitPrice || item.price || 0), totalPrice: Number(item.totalPrice || (item.quantity || item.qty || 1) * (item.unitPrice || item.price || 0)), note: item.note || null })));
      if (data.visitorId || req.headers['x-visitor-id']) {
        await Promise.all(items.map((item: any) => CreateProductInteractionService.purchase({companyId: user.companyId, productId: Number(item.productId || item.id), visitorId: String(data.visitorId || req.headers['x-visitor-id']), customerId: person.id, orderId: order.id, quantity: Number(item.quantity || item.qty || 1)})));
      }
      await OrderStatus.create({ orderId: order.id, statusId: 1, userId: Number(user.id), note: 'Pedido criado pelo PDV' });
      return res.json(responseSuccess({ ...order.toJSON(), id: order.id, code: order.id, status: 'RECEBIDO', statusLabel: 'Pedido recebido' }));
    } catch (error) { return HandlerError(error, res); }
  }

  async destroy(_req: Request, res: Response): Promise<Response> {
    return res.status(405).json({ message: 'Pedidos não podem ser excluídos.' });
  }
}

export default new OrderController();
