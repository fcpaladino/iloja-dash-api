import {Request, Response} from "express";
import {yup} from "../../utils/yup";
import {HandlerError} from "../../errors/HandlerError";
import { TryCatch } from '../../helpers/TryCatch';
import People from "../../models/People";
import {responseSuccess} from "../../helpers/response";
import PeopleAddress from "../../models/PeopleAddress";
import {Op} from "sequelize";
import {whereSearch} from "../../database/sequelizeExtension";
import {buildFilters} from "../../helpers/buildFilters";
import WalletTransaction from "../../models/WalletTransaction";

const validateForm = async (data: IPeopleItem, id: number | null = null) => {
  const schema = yup.object().shape({
    name: yup.string().required(),
  });
  await schema.validate(data, { abortEarly: false });
};

class PeopleController {
  constructor() {
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
    this.lookupByPhone = this.lookupByPhone.bind(this);
  }

  @TryCatch()
  async lookupByPhone(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      let digits = String(req.params.phone || '').replace(/\D/g, '');
      if (digits.startsWith('55')) digits = digits.slice(2);
      const normalized = digits.length >= 10 ? `${digits.slice(0, 2)}${digits.slice(-8)}` : digits;
      const suffix = digits.slice(-8);
      const item = await People.findOne({
        where: {
          companyId: user.companyId,
          [Op.or]: [
            { waId: normalized },
            { phoneNumber: { [Op.like]: `%${suffix}` } },
          ],
        },
        attributes: ['id', 'legalName', 'tradeName', 'phoneNumber', 'documentNumber', 'email'],
      });
      if (!item) return res.status(404).json({ message: 'Cliente não encontrado.' });
      return res.json(responseSuccess({ ...item.toJSON(), name: item.tradeName || item.legalName }));
    } catch (error) {
      return HandlerError(error, res);
    }
  }

  @TryCatch()
  async index (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {page, orderBy} = req.query as FiltersQuery;
      const order: any = orderBy ? orderBy?.map(item => [String(item.name), String(item.order)]) : [["legalName", "asc"]];

      const filters = buildFilters(req.query);

      const conditions = [
        whereSearch('companyId', '=', user.companyId),
      ].filter(Boolean);

      const where = conditions.length > 0 ? { [Op.and]: conditions, ...filters } : {};

      const items = await People.paginate(user.companyId, {
        page,
        where: where,
        order: order,
        attributes: ['id', 'legalName', 'tradeName', 'personType', 'typeId', 'phoneNumber', 'customerPortalAccess', 'walletBalance', 'point'],
      });

      return res.json({data: items.items, meta: items.meta});

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async show(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {id} = req.params;

      const item = await People.findByPk(id, {
        attributes: ['id', 'personType', 'typeId', 'documentNumber', 'legalName', 'tradeName', 'phoneNumber', 'email', 'active', 'customerPortalAccess', 'note', 'walletBalance', 'point'],
      });

      const address = await PeopleAddress.findOne({
        where:{peopleId: item.id},
        attributes: ['zip', 'state', 'city', 'address', 'number', 'district', 'complement']
      })

      return res.json(responseSuccess({
        ...item.dataValues,
        ...address.dataValues
      }));

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async store (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const data = req.body as IPeopleItem;

      await validateForm(data);

      // await ValidateField({model: Status, field: 'name', value: data.name.trim(), messageError: 'Nome já em uso.'});

      data.companyId = user.companyId;

      const item = await People.create(data);
      const address = await PeopleAddress.create({...data, streetId: 1, peopleId: item.id});

      return res.json(responseSuccess({item, address}));

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async update (req: Request, res: Response): Promise<Response> {

    const user = req.user as IReqUser;
    const {id} = req.params;
    const data = req.body as IPeopleItem;

    // await validateForm(data, id);
    //
    // await ValidateField({model: Status, field: 'name', value: data.name.trim(), id, messageError: 'Nome já em uso.'});
    //
    const item = await People.findByPk(id);
    const address = await PeopleAddress.findOne({
      where:{peopleId: item.id},
    });

    const previousWallet = Number(item.walletBalance || 0);
    if (data.walletBalance !== undefined) data.walletBalance = Math.max(0, Number(data.walletBalance) || 0);
    await item.update(data);
    if (data.walletBalance !== undefined && Number(data.walletBalance) !== previousWallet) {
      await WalletTransaction.create({
        companyId: user.companyId,
        peopleId: item.id,
        type: Number(data.walletBalance) > previousWallet ? 'CREDIT' : 'ADJUSTMENT',
        amount: Number((Number(data.walletBalance) - previousWallet).toFixed(2)),
        balanceBefore: previousWallet,
        balanceAfter: Number(data.walletBalance),
        metadata: {source: 'people_update'},
      });
    }
    await address.update(data);

    return res.json(responseSuccess({item}));
  }

  @TryCatch()
  async destroy (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {ids} = req.params;

      for (const id of ids.split(';')) {
        await People.destroy({ where: { id } });
      }

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }

}

export default new PeopleController();




