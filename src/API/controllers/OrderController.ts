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

      const v = String(data.client.number).replace(/\D/g, "");
      const waId = `${v.slice(0, 2)}${v.slice(-8)}`

      const point = Math.floor(data.total);

      const [people, created] = await People.findOrCreate({
        where:{
          companyId: companyId,
          waId: waId
        },
        defaults:{
          companyId: companyId,
          waId: waId,
          legalName: data.client.name,
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
        paymentMethodId: data.pagamento.id??null,
        couponId: data.cupom.id??null,
        deliveryTypeId: data.recebimento.id??null,
        statusId: 1,
        subtotal: data.subtotal,
        total: data.total,
        note: data.obs,
        changeValue: data.pagamento.changeValue??null,
        pointGenerated: Math.floor(data.total),
      });

      if(data.items && Array.isArray(data.items)){
        for(let item of data.items){
          await OrderItem.create({
            orderId: order.id,
            productId: item.id,
            productRef: item.ref??item.id,
            productName: item.name,
            quantity: item.qty,
            unitPrice: item.price,
            totalPrice: (item.qty * parseFloat(item.price)),
            note: item?.obs??null
          });
        }
      }

      await OrderStatus.create({
        orderId: order.id,
        statusId: 1,
        note: 'Pedido criado'
      });



      return responseSuccess(res, []);
    } catch (e){
      console.error(e);
      return HandlerError(res, e, 'Api.Order.store');
    }
  }


}

export default new OrderController();
