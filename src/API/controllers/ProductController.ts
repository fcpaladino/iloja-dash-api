import {Request, Response} from "express";
import {HandlerError} from "../helpers/HandleErrors";
import responseSuccess from "../responses/responseList";
import {IReqParams} from "../interfaces/reqParams";
import {IQueryFilter} from "../interfaces/queryFilter";
import Product from "../../models/Product";
import {whereSearch} from "../../database/sequelizeExtension";
import {Op} from "sequelize";

class ProductController {
  constructor() {
    this.list = this.list.bind(this);
    this.show = this.show.bind(this);
  }

  async list(req: Request, res: Response): Promise<Response> {
    try{
      const {companyId} = req.params as unknown as IReqParams;
      const {page = 1, search, categoryId = '-1', brandId = '-1', groupId = '-1', subgroupId = '-1', filterItemId = '-1'} = req.query as unknown as IQueryFilter;


      const searchCond = (typeof search === 'string' && search.trim())
        ? {
          [Op.or]: [
            whereSearch('ref', 'like', search),
            whereSearch('name', 'like', search),
          ].filter(Boolean)
        }
        : null;

      const conditions = [
        whereSearch('companyId', '=', companyId),
        whereSearch('active', 'bool', true),
        whereSearch('categoryId', '=', categoryId),
        whereSearch('brandId', '=', brandId),
        whereSearch('groupId', '=', groupId),
        whereSearch('subGroupId', '=', subgroupId),
        searchCond
      ].filter(Boolean);
      const where = conditions.length > 0 ? { [Op.and]: conditions } : {};


      const {items, meta} = await Product.paginateWithCache(companyId, {
        page,
        where: where,
      })

      return responseSuccess(res, items, meta);
    } catch (e){
      console.error(e);
      return HandlerError(res, e, 'Api.Product.list');
    }
  }


  async show(req: Request, res: Response): Promise<Response> {
    try{
      const {companyId, id} = req.params as unknown as IReqParams;

      const item = await Product.findOneWithCache(companyId, {
        where: {companyId, id}
      });

      // const tag = await Tag.findOne({
      //   where:{companyId, id}
      // });
      //
      // if(!tag) throw new AppError('Tag não encontrada.');
      //
      // const normalize = tagShowNormalize(tag.dataValues);
      // const result = sanitizeType<ITag>([normalize], ITagShow);
      //
      return responseSuccess(res, [item]);

    } catch (e){
      return HandlerError(res, e, 'Api.Product.show');
    }
  }

}

export default new ProductController();
