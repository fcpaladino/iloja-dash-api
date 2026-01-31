import {Request, Response} from "express";
// import Status from "../../models/Status";
import {yup} from "../../utils/yup";
import {HandlerError} from "../../errors/HandlerError";
import {responseSuccess} from "../../helpers/response";
import {whereSearch} from "../../database/sequelizeExtension";
import ValidateField from "../../services/ValidateField";
import { TryCatch } from '../../helpers/TryCatch';
import {Op} from "sequelize";

const validateForm = async (data: IStatusItem, id: number | null = null) => {
  const schema = yup.object().shape({
    name: yup.string().required(),
  });
  await schema.validate(data, { abortEarly: false });
};

class StatusController {
  constructor() {
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
  }

  @TryCatch()
  async index (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {search, page, orderBy} = req.query as FiltersQuery;
      const order: any = orderBy ? orderBy?.map(item => [String(item.name), String(item.order)]) : [["name", "asc"]];

      // const conditions = [
      //   // whereSearch('companyId', '=', user.companyId),
      //   // whereSearch('name', 'like', search),
      // ].filter(Boolean);

      // const where = conditions.length > 0 ? { [Op.and]: conditions } : {};

      // const items = await Status.paginate(user.companyId, {
      //   page,
      //   // where: where,
      //   order: order,
      //   attributes: ['id', 'name'],
      // });
      //
      // return res.json({data: items.items, meta: items.meta});

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async show(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {id} = req.params;

      // const item = await Status.findByPk(id, {
      //   attributes: ['id', 'name', 'companyId', 'createdAt', 'updatedAt'],
      // });
      //
      // return res.json(responseSuccess(item.dataValues));

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async store (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const data = req.body as IStatusItem;

      await validateForm(data);

      // await ValidateField({model: Status, field: 'name', value: data.name.trim(), messageError: 'Nome já em uso.'});
      //
      // data.companyId = user.companyId;
      //
      // const item = await Status.create(data);
      //
      // return res.json(responseSuccess({item}));

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async update (req: Request, res: Response): Promise<Response> {

    const user = req.user as IReqUser;
    const {id} = req.params;
    const data = req.body as IStatusItem;

    // await validateForm(data, id);
    //
    // await ValidateField({model: Status, field: 'name', value: data.name.trim(), id, messageError: 'Nome já em uso.'});
    //
    // const item = await Status.findByPk(id);
    //
    // await item.update(data);
    //
    // return res.json(responseSuccess({item}));
  }

  @TryCatch()
  async destroy (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {ids} = req.params;

      // for (const id of ids.split(';')) {
      //   await Status.destroy({ where: { id } });
      // }

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }

}

export default new StatusController();




