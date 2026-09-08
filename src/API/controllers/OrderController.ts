import {Request, Response} from "express";
import {HandlerError} from "../helpers/HandleErrors";
import responseSuccess from "../responses/responseList";
import {IReqParams} from "../interfaces/reqParams";
import People from "../../models/People";
import Order from "../../models/Order";
import OrderItem from "../../models/OrderItem";
import OrderStatus from "../../models/OrderStatus";
import {CreateProductInteractionService} from "../../services/CreateProductInteractionService";
import AnalyticsEvent from "../../models/AnalyticsEvent";
import Company from "../../models/Company";
import Product from "../../models/Product";
import PointTransaction from "../../models/PointTransaction";
import WalletTransaction from "../../models/WalletTransaction";


class OrderController {
  constructor() {
    this.store = this.store.bind(this);
  }

  async store(req: Request, res: Response): Promise<Response> {
    try{
      const {companyId} = req.params as unknown as IReqParams;
      const data = req.body;
      const company = await Company.findByPk(companyId);
      const items = Array.isArray(data.items) ? data.items : [];
      const productIds = items.map((item: any) => Number(item.productId ?? item.id)).filter(Boolean);
      const products = await Product.findAll({where: {companyId, id: productIds}});
      const productsById = new Map(products.map((product) => [product.id, product]));
      const pointsUsed = items.reduce((sum: number, item: any) => {
        const product: any = productsById.get(Number(item.productId ?? item.id));
        const paymentType = item.paymentType || (product?.pointsOnly ? 'points' : product?.pointsAndMoney ? 'points_and_money' : 'money');
        if (paymentType === 'points_and_money' && data.usePoints !== true) return sum;
        if (paymentType !== 'points' && paymentType !== 'points_and_money') return sum;
        return sum + Number(item.pointsCost ?? product?.pointsCost ?? product?.point ?? 0) * Number(item.quantity ?? 1);
      }, 0);
      const totalBeforeWallet = Math.max(0, Number(data.totalBeforeWallet ?? data.total ?? 0));
      const requestedWalletUse = data.useWallet === true ? totalBeforeWallet : 0;
      if (pointsUsed > 0 && !company?.pointsEnabled) return res.status(422).json({message: 'O sistema de pontos está desativado.'});
      const peopleData = data.people || data.client || {};
      const whatsapp = peopleData.whatsapp || peopleData.number || "";

      let v = String(whatsapp).replace(/\D/g, "");
      if (v.startsWith("55") && v.length > 11) v = v.slice(2);
      const waId = v.length >= 10 ? `${v.slice(0, 2)}${v.slice(-8)}` : v;

      const existingPerson = await People.findOne({where: {companyId, waId}});
      const currentPoints = Number(existingPerson?.point || 0);
      const currentWallet = Number(existingPerson?.walletBalance || 0);
      const walletUsed = Math.min(Math.max(0, requestedWalletUse), currentWallet);
      const payableTotal = Math.max(0, totalBeforeWallet - walletUsed);
      if (pointsUsed > currentPoints) return res.status(422).json({message: `Pontos insuficientes. Saldo atual: ${currentPoints}.`});
      const point = company?.pointsEnabled && data.generatePoints !== false
        ? Math.floor(payableTotal * Number(company.pointValue || 1))
        : 0;

      const [people, created] = await People.findOrCreate({
        where:{
          companyId: companyId,
          waId: waId
        },
        defaults:{
          companyId: companyId,
          waId: waId,
          legalName: peopleData.name,
          phoneNumber: v,
          point
        }
      });
      if(!created){
        await People.increment(
          { point: point },
          { where: { id: people.id } }
        );
      }

      const order = await Order.create({
        companyId,
        userId: req.user?.id ? Number(req.user.id) : null,
        peopleId: people.id,
        paymentMethodId: data.paymentMethodId ?? data.pagamento?.id ?? null,
        couponId: data.couponId ?? data.cupom?.id ?? null,
        deliveryTypeId: data.deliveryTypeId ?? data.recebimento?.id ?? null,
        statusId: 1,
        subtotal: data.subtotal,
        total: payableTotal,
        note: data.note ?? data.obs ?? null,
        changeValue: data.changeValue ?? data.pagamento?.changeValue ?? null,
        shippingValue: data.shippingValue ?? 0,
        discountValue: data.discountValue ?? 0,
        pointGenerated: point,
        pointUsed: pointsUsed,
        walletUsed,
        visitorId: data.visitorId || req.headers['x-visitor-id'] || null,
      });

      let balance = created ? point : currentPoints + point;
      if (pointsUsed > 0) {
        await PointTransaction.create({companyId, peopleId: people.id, orderId: order.id, type: 'REDEEM', points: -pointsUsed, balanceBefore: balance, balanceAfter: balance - pointsUsed, metadata: {items: items.map((item: any) => ({productId: item.productId ?? item.id, quantity: item.quantity}))}});
        balance -= pointsUsed;
        await people.update({point: balance});
      }
      if (point > 0) {
        await PointTransaction.create({companyId, peopleId: people.id, orderId: order.id, type: 'EARN', points: point, balanceBefore: created ? 0 : currentPoints, balanceAfter: created ? point : currentPoints + point, metadata: {source: 'order'}});
      }
      if (walletUsed > 0) {
        await WalletTransaction.create({companyId, peopleId: people.id, orderId: order.id, type: 'DEBIT', amount: -walletUsed, balanceBefore: currentWallet, balanceAfter: currentWallet - walletUsed, metadata: {source: 'order'}});
        await people.update({walletBalance: currentWallet - walletUsed});
      }

      if(items.length){
        for(let item of items){
          await OrderItem.create({
            orderId: order.id,
            productId: item.productId ?? item.id,
            productRef: item.productRef ?? item.ref ?? item.productId ?? item.id,
            productName: item.productName ?? item.name,
            quantity: item.quantity ?? item.qty,
            unitPrice: item.unitPrice ?? item.price,
            totalPrice: item.totalPrice ?? ((item.quantity ?? item.qty) * parseFloat(item.unitPrice ?? item.price)),
            note: item.note ?? item.obs ?? null
          });
        }
      }
      if (order.visitorId && data.items && Array.isArray(data.items)) {
        await Promise.all(data.items.map(async (item: any) => {
          const productId = Number(item.productId ?? item.id);
          const quantity = Number(item.quantity ?? item.qty ?? 1);
          await CreateProductInteractionService.purchase({companyId: Number(companyId), productId, visitorId: String(order.visitorId), customerId: people.id, orderId: order.id, quantity});
          await AnalyticsEvent.create({companyId: Number(companyId), event: "purchase", deviceId: data.deviceId || null, sessionId: data.sessionId || null, productId: String(productId), productName: item.productName ?? item.name ?? null, quantity, value: Number(item.unitPrice ?? item.price ?? 0), metadata: {orderId: order.id, source: "backend"}});
        }));
      }

      await OrderStatus.create({
        orderId: order.id,
        statusId: 1,
        note: 'Pedido criado'
      });



      return responseSuccess(res, [{
        ...data,
        id: order.id,
        pointsBalance: balance,
        pointsUsed,
        pointsGenerated: point,
        walletBalance: currentWallet - walletUsed,
        walletUsed,
        createdAt: order.createdAt,
        statusKey: "received",
        statusLabel: "Pedido recebido",
      }]);
    } catch (e){
      console.error(e);
      return HandlerError(res, e, 'Api.Order.store');
    }
  }


}

export default new OrderController();
