import {Request, Response} from "express";
import {HandlerError} from "../helpers/HandleErrors";
import responseSuccess from "../responses/responseList";
import {IReqParams} from "../interfaces/reqParams";
import {IQueryFilter} from "../interfaces/queryFilter";
import Category from "../../models/Category";
import Brand from "../../models/Brand";
import Group from "../../models/Group";
import SubGroup from "../../models/SubGroup";
import Filter from "../../models/Filter";
import FilterItem from "../../models/FilterItem";

class FilterController {
  constructor() {
    this.list = this.list.bind(this);
  }

  async list(req: Request, res: Response): Promise<Response> {
    try{
      const {companyId} = req.params as unknown as IReqParams;

      const categories = await Category.findAllWithCache(companyId, {
        where: {
          companyId,
          active: true
        },
        attributes: ['id', 'name', 'slug'],
        order: [["name", "ASC"]]
      })

      const brands = await Brand.findAllWithCache(companyId, {
        where: {
          companyId,
          active: true
        },
        attributes: ['id', 'name', 'slug'],
        order: [["name", "ASC"]]
      })

      const groups = await Group.findAllWithCache(companyId, {
        where: {
          companyId,
          active: true
        },
        include: [{
          model: SubGroup,
          as: "subGroups",
          where: {
            active: true
          },
        }],
        attributes: ['id', 'name', 'slug'],
        order: [
          ["name", "ASC"],
          [{ model: SubGroup, as: "subGroups" }, "name", "ASC"],
        ]
      })

      const filters = await Filter.findAllWithCache(companyId, {
        where: {
          companyId,
          active: true
        },
        include: [{
          model: FilterItem,
          as: "filterItems",
          where: {
            active: true
          },
          attributes: ['id', 'name', 'slug'],
        }],
        attributes: ['id', 'name', 'slug'],
        order: [
          ["name", "ASC"],
          [{ model: FilterItem, as: "filterItems" }, "name", "ASC"],
        ]
      })



      const items = [{
        categories,
        brands,
        groups,
        filters
      }];

      return responseSuccess(res, items);
    } catch (e){
      console.error(e);
      return HandlerError(res, e, 'Api.Filter.list');
    }
  }


}

export default new FilterController();
