import {Request, Response} from "express";
import {yup} from "../../utils/yup";
import {HandlerError} from "../../errors/HandlerError";
import { TryCatch } from '../../helpers/TryCatch';
import SubGroup from "../../models/SubGroup";
import {responseSuccess} from "../../helpers/response";
import {Op} from "sequelize";
import {whereSearch} from "../../database/sequelizeExtension";
import {buildFilters} from "../../helpers/buildFilters";
import {slugify} from "../../helpers/slugify";

const validateForm = async (data: ISubGroupItem, id: number | null = null) => {
  const schema = yup.object().shape({
    name: yup.string().required(),
  });
  await schema.validate(data, { abortEarly: false });
};

class SubGroupController {
  constructor() {
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
    this.lists = this.lists.bind(this);
  }

  @TryCatch()
  async index (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {page, orderBy} = req.query as FiltersQuery;
      const order: any = orderBy ? orderBy?.map(item => [String(item.name), String(item.order)]) : [["name", "asc"]];

      const filters = buildFilters(req.query);

      const conditions = [
        whereSearch('companyId', '=', user.companyId),
      ].filter(Boolean);

      const where = conditions.length > 0 ? { [Op.and]: conditions, ...filters } : {};

      const items = await SubGroup.paginate(user.companyId, {
        page,
        where: where,
        order: order,
        attributes: ['id', 'name', 'groupId', 'active'],
      });

      return res.json({data: items.items, meta: items.meta});

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async lists (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {groupId} = req.query;

      const items = await SubGroup.findAll({
        where: {companyId: user.companyId, groupId},
        attributes: ['id', 'name']
      });

      return res.json({data: items});

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async show(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {id} = req.params;

      const item = await SubGroup.findByPk(id, {
        attributes: ['id', 'name', 'groupId', 'active'],
      });

      return res.json(responseSuccess({
        ...item.dataValues
      }));

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async store (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const data = req.body as ISubGroupItem;

      await validateForm(data);

      // await ValidateField({model: Status, field: 'name', value: data.name.trim(), messageError: 'Nome já em uso.'});

      data.companyId = user.companyId;
      data.slug = data.slug ?? slugify(data.name);

      const item = await SubGroup.create(data);

      return res.json(responseSuccess({item}));

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async update (req: Request, res: Response): Promise<Response> {

    const user = req.user as IReqUser;
    const {id} = req.params;
    const data = req.body as ISubGroupItem;

    // await validateForm(data, id);
    //
    // await ValidateField({model: Status, field: 'name', value: data.name.trim(), id, messageError: 'Nome já em uso.'});
    //
    const item = await SubGroup.findByPk(id);
    data.slug = data.slug ?? slugify(data.name);
    await item.update(data);

    return res.json(responseSuccess({item}));
  }

  @TryCatch()
  async destroy (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {ids} = req.params;

      for (const id of ids.split(';')) {
        await SubGroup.destroy({ where: { id } });
      }

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }

}

export default new SubGroupController();




