import {Request, Response} from "express";
import {yup} from "../../utils/yup";
import {HandlerError} from "../../errors/HandlerError";
import { TryCatch } from '../../helpers/TryCatch';
import Filter from "../../models/Filter";
import {responseSuccess} from "../../helpers/response";
import {Op} from "sequelize";
import {whereSearch} from "../../database/sequelizeExtension";
import {buildFilters} from "../../helpers/buildFilters";
import Category from "../../models/Category";
import FilterItem from "../../models/FilterItem";
import sequelize from "../../database";
import {slugify} from "../../helpers/slugify";

const validateForm = async (data: IFilterItem, id: number | null = null) => {
  const schema = yup.object().shape({
    name: yup.string().required(),
  });
  await schema.validate(data, { abortEarly: false });
};

class FilterController {
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

      const items = await Filter.paginate(user.companyId, {
        page,
        where: where,
        order: order,
        attributes: ['id', 'name', 'active'],
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

      const items = await Filter.findAll({
        where: {companyId: user.companyId},
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

      const item = await Filter.findByPk(id, {
        attributes: ['id', 'name', 'active'],
      });
      const items = await FilterItem.findAll({
        where:{
          filterId: item.id
        },
        attributes: ['id', 'name', 'active'],
        order: [['order', 'asc']]
      });

      return res.json(responseSuccess({
        ...item.dataValues, items: items.map(vars => vars.dataValues)
      }));

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async store (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const data = req.body as IFilterItem;

      await validateForm(data);

      // await ValidateField({model: Status, field: 'name', value: data.name.trim(), messageError: 'Nome já em uso.'});

      data.companyId = user.companyId;


      const item = await sequelize.transaction(async (t) => {
        const created = await Filter.create(data as any, { transaction: t });

        if (Array.isArray(data.items) && data.items.length) {
          await FilterItem.bulkCreate(
            data.items.map((vars: any) => ({
              ...vars,
              filterId: created.id,
            })),
            { transaction: t }
          );
        }

        return created;
      });


      return res.json(responseSuccess({item}));

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async update (req: Request, res: Response): Promise<Response> {

    const user = req.user as IReqUser;
    const {id} = req.params;
    const data = req.body as IFilterItem;

    // await validateForm(data, id);
    //
    // await ValidateField({model: Status, field: 'name', value: data.name.trim(), id, messageError: 'Nome já em uso.'});
    //
    // const item = await Filter.findByPk(id);

    // await item.update(data);

    const item = await sequelize.transaction(async (t) => {
      const filter = await Filter.findOne({
        where: { id, companyId: user.companyId },
        transaction: t,
      });

      if (!filter) {
        throw new Error("Filtro não encontrado");
      }

      // 1) atualiza cabeçalho
      await filter.update(
        {
          name: data.name,
          active: data.active,
        } as any,
        { transaction: t }
      );

      // 2) sync items (se veio items no payload)
      if (Array.isArray(data.items)) {
        const dbItems = await FilterItem.findAll({
          where: { filterId: filter.id },
          transaction: t,
        });

        const dbIds = new Set(dbItems.map((i) => i.id));

        const incomingWithId = data.items.filter((i: any) => i.id);
        const incomingIds = new Set(incomingWithId.map((i: any) => Number(i.id)));

        // deletar: existe no banco e não veio no payload
        const idsToDelete = [...dbIds].filter((dbId) => !incomingIds.has(dbId));

        if (idsToDelete.length) {
          await FilterItem.destroy({
            where: {
              id: { [Op.in]: idsToDelete },
              filterId: filter.id,
            },
            transaction: t,
          });
        }

        // update: veio com id
        for (const it of incomingWithId) {
          await FilterItem.update(
            { name: it.name, active: it.active } as any,
            {
              where: {
                id: Number(it.id),
                filterId: filter.id,
              },
              transaction: t, individualHooks: true,
            }
          );
        }

        // create: sem id
        const toCreate = data.items.filter((i: any) => !i.id);
        if (toCreate.length) {
          await FilterItem.bulkCreate(
            toCreate.map((it: any) => ({
              filterId: filter.id,
              name: it.name,
              active: it.active ?? true,
            })),
            { transaction: t, individualHooks: true, }
          );
        }
      }

      return filter;
    });

    return res.json(responseSuccess({item}));
  }

  @TryCatch()
  async destroy (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {ids} = req.params;

      for (const id of ids.split(';')) {
        await Filter.destroy({ where: { id } });
        await FilterItem.destroy({ where: { filterId:id } });
      }

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }

}

export default new FilterController();




