import {Request, Response} from "express";
import {HandlerError} from "../helpers/HandleErrors";
import responseSuccess from "../responses/responseList";
import {IReqParams} from "../interfaces/reqParams";
import People from "../../models/People";
import Order from "../../models/Order";
import OrderItem from "../../models/OrderItem";
import OrderStatus from "../../models/OrderStatus";


class OrderController {
  constructor() {
    this.store = this.store.bind(this);
  }

  async store(req: Request, res: Response): Promise<Response> {
    try{
      const {companyId} = req.params as unknown as IReqParams;
      const data = req.body;
      const peopleData = data.people || data.client || {};
      const whatsapp = peopleData.whatsapp || peopleData.number || "";

      let v = String(whatsapp).replace(/\D/g, "");
      if (v.startsWith("55") && v.length > 11) v = v.slice(2);
      const waId = v.length >= 10 ? `${v.slice(0, 2)}${v.slice(-8)}` : v;

      const point = Math.floor(data.total);

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
        peopleId: people.id,
        paymentMethodId: data.paymentMethodId ?? data.pagamento?.id ?? null,
        couponId: data.couponId ?? data.cupom?.id ?? null,
        deliveryTypeId: data.deliveryTypeId ?? data.recebimento?.id ?? null,
        statusId: 1,
        subtotal: data.subtotal,
        total: data.total,
        note: data.note ?? data.obs ?? null,
        changeValue: data.changeValue ?? data.pagamento?.changeValue ?? null,
        shippingValue: data.shippingValue ?? 0,
        discountValue: data.discountValue ?? 0,
        pointGenerated: Math.floor(data.total),
      });

      if(data.items && Array.isArray(data.items)){
        for(let item of data.items){
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

      await OrderStatus.create({
        orderId: order.id,
        statusId: 1,
        note: 'Pedido criado'
      });



      return responseSuccess(res, [{
        ...data,
        id: order.id,
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
