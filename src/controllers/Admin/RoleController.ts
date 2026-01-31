import {Request, Response} from "express";
import Role from "../../models/Role";
import {yup} from "../../utils/yup";
import {HandlerError} from "../../errors/HandlerError";
import {responseSuccess} from "../../helpers/response";
import {whereSearch} from "../../database/sequelizeExtension";
import {TryCatch} from "../../helpers/TryCatch";
import {listAllPermissions} from "../../db/permissions";


const validateForm = async (data: IRoleItem, id: number | null = null) => {
  const schema = yup.object().shape({
    name: yup.string(),
    permissions: yup.mixed()
  });
  await schema.validate(data, { abortEarly: false });
};

class RoleController {
  constructor() {
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
    this.getPermissions = this.getPermissions.bind(this);
  }

  @TryCatch()
  async index (req: Request, res: Response): Promise<Response>{
    try {
      const user = req.user as IReqUser;
      const {search, page, orderBy, status} = req.query as FiltersQuery;
      const order: any = orderBy ? orderBy?.map(item => [String(item.name), String(item.order)]) : [["name", "asc"]];

      // orderBy?.map(item => [String(item.name), String(item.order)])


      const where = {
        companyId: user.companyId,
        ...whereSearch('name', 'like', search),
      };

      const items = await Role.paginate(1,{
        page,
        where: where,
        order: order,
      });

      return res.json({data: items.items, meta: items.meta});

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async list (req: Request, res: Response): Promise<Response>{
    try {
      const user = req.user as IReqUser;

      const items = await Role.findAll({
        where: {companyId: user.companyId},
        attributes: ['id', 'name']
      });

      return res.json({data: items});

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async show (req: Request, res: Response): Promise<Response>{
    try {
      const {id} = req.params;

      const item = await Role.findByPk(id, {attributes: ['id', 'name', 'description', 'permissions']});

      return res.json({
        data: {...item.dataValues, permissions: item?.permissions?.split('|')?.map(p => {
            const [id, value] = p.split(':');
            return {id: parseInt(id), value: parseInt(value)};
          })},
      });

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async store (req: Request, res: Response): Promise<Response>{
    try {
      const user = req.user as IReqUser;
      const data = req.body as IRoleItem;

      // await validateForm(data);

      data.companyId = user.companyId;
      data.permissions = objToString(data.permissions);

      const item = await Role.create(data);

      return res.json(responseSuccess({item}));

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async update (req: Request, res: Response): Promise<Response>{
    try {
      const user = req.user as IReqUser;
      const {id} = req.params;
      const data = req.body as IRoleItem;

      // await validateForm(data, id);

      data.permissions = objToString(data.permissions);
      const item = await Role.findByPk(id);

      await item.update(data);

      return res.json({item});

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async destroy (req: Request, res: Response): Promise<Response>{
    try {
      const user = req.user as IReqUser;
      const {ids} = req.params;

      for (const id of ids.split(';')) {
        await Role.destroy({ where: { id } });
      }

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async getPermissions (req: Request, res: Response): Promise<Response>{
    try {
      const user = req.user as IReqUser;

      return res.json({items: listAllPermissions()});
    } catch (e) {
      return HandlerError(e, res);
    }
  }

}

export const objToString = (obj = []) => {
  return obj.map(p => (`${p.id}:${p.value}`)).join('|');
}

export default new RoleController();



