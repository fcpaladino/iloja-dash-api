import {Request, Response} from "express";
import ShippingNeighborhod from "../../models/ShippingNeighborhod";
import {HandlerError} from "../helpers/HandleErrors";
import responseSuccess from "../responses/responseList";

class ShippingNeighborhoodController {
  async list(req: Request, res: Response): Promise<Response> {
    try {
      const companyId = Number(req.params.companyId);
      const neighborhoods = await ShippingNeighborhod.findAll({
        where: {companyId},
        attributes: ["id", "name", "price"],
        order: [["name", "ASC"]],
      });

      return responseSuccess(res, neighborhoods);
    } catch (error) {
      return HandlerError(res, error, "Api.ShippingNeighborhood.list");
    }
  }
}

export default new ShippingNeighborhoodController();
