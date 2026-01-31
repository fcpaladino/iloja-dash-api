import {Request, Response} from "express";
import {HandlerError} from "../helpers/HandleErrors";
import responseSuccess from "../responses/responseList";
import {IReqParams} from "../interfaces/reqParams";
import PaymentMethod from "../../models/PaymentMethod";

class PaymentMethodController {
  constructor() {
    this.list = this.list.bind(this);
  }

  async list(req: Request, res: Response): Promise<Response> {
    try{
      const {companyId} = req.params as unknown as IReqParams;

      const items = await PaymentMethod.findAllWithCache(companyId, {
        where: {
          companyId,
          active: true
        },
        attributes: ['id', 'name', 'enabledChange', 'pixValue', 'isDefault'],
        order: [["name", "ASC"]]
      })


      return responseSuccess(res, items);
    } catch (e){
      console.error(e);
      return HandlerError(res, e, 'Api.PaymentMethod.list');
    }
  }


}

export default new PaymentMethodController();
