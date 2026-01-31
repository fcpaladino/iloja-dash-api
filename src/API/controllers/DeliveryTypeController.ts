import {Request, Response} from "express";
import {HandlerError} from "../helpers/HandleErrors";
import responseSuccess from "../responses/responseList";
import {IReqParams} from "../interfaces/reqParams";
import DeliveryType from "../../models/DeliveryType";

class DeliveryTypeController {
  constructor() {
    this.list = this.list.bind(this);
  }

  async list(req: Request, res: Response): Promise<Response> {
    try{
      const {companyId} = req.params as unknown as IReqParams;

      const items = await DeliveryType.findAllWithCache(companyId, {
        where: {
          companyId,
          active: true
        },
        attributes: ['id', 'name', 'typeId', 'description', 'enableAddress'],
        order: [["name", "ASC"]]
      })


      return responseSuccess(res, items);
    } catch (e){
      console.error(e);
      return HandlerError(res, e, 'Api.DeliveryType.list');
    }
  }


}

export default new DeliveryTypeController();
