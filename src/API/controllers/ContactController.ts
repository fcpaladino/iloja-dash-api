import {Request, Response} from "express";
import {HandlerError} from "../helpers/HandleErrors";
import responseSuccess from "../responses/responseList";
import {IReqParams} from "../interfaces/reqParams";

class ContactController {
  constructor() {
    this.store = this.store.bind(this);
  }

  async store(req: Request, res: Response): Promise<Response> {
    try{
      const {companyId} = req.params as unknown as IReqParams;




      return responseSuccess(res, []);
    } catch (e){
      console.error(e);
      return HandlerError(res, e, 'Api.Order.store');
    }
  }


}

export default new ContactController();
