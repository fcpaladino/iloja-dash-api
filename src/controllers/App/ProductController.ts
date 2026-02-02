import {Request, Response} from "express";
import { File as MulterFile } from 'multer';
import {yup} from "../../utils/yup";
import {HandlerError} from "../../errors/HandlerError";
import { TryCatch } from '../../helpers/TryCatch';
import Product from "../../models/Product";
import {responseSuccess} from "../../helpers/response";
import {Op} from "sequelize";
import {whereSearch} from "../../database/sequelizeExtension";
import {buildFilters} from "../../helpers/buildFilters";
import {gerarHashEmail} from "../../utils/helpers";
import {remove, rename} from "../../utils/file";
import {logDevJson} from "../../helpers/logDev";
import ProductImage from "../../models/ProductImage";

const validateForm = async (data: IProductItem, id: number | null = null) => {
  const schema = yup.object().shape({
    name: yup.string().required(),
  });
  await schema.validate(data, { abortEarly: false });
};

class ProductController {
  constructor() {
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
    this.lists = this.lists.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.destroyImage = this.destroyImage.bind(this);
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

      const items = await Product.paginate(user.companyId, {
        page,
        where: where,
        order: order,
        attributes: ['id', 'name', 'active', 'price', 'pricePromotional', 'point', 'isNew', 'isPopular', 'isPromotional', 'ref', 'image'],
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

      const items = await Product.findAll({
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

      const item = await Product.findByPk(id);

      return res.json(responseSuccess({
        ...item.dataValues, image: item.image? `${item.image}` : null
      }));

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async store (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const data = req.body as IProductItem;

      await validateForm(data);

      // await ValidateField({model: Status, field: 'name', value: data.name.trim(), messageError: 'Nome já em uso.'});

      data.companyId = user.companyId;
      data.isPromotional = data?.pricePromotional && data?.pricePromotional > 0;

      const item = await Product.create(data);

      return res.json(responseSuccess({...item.dataValues}));

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async update (req: Request, res: Response): Promise<Response> {

    const user = req.user as IReqUser;
    const {id} = req.params;
    const data = req.body as IProductItem;

    // await validateForm(data, id);
    //
    // await ValidateField({model: Status, field: 'name', value: data.name.trim(), id, messageError: 'Nome já em uso.'});
    //
    data.isPromotional = data?.pricePromotional && data?.pricePromotional > 0;

    const item = await Product.findByPk(id);

    await item.update(data);

    return res.json(responseSuccess({...item.dataValues}));
  }

  @TryCatch()
  async destroy (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {ids} = req.params;

      for (const id of ids.split(';')) {
        await Product.destroy({ where: { id } });
      }

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }




  @TryCatch()
  async uploadImage (req: Request, res: Response): Promise<Response> {
    try {
      const userReq = req.user as IReqUser;
      const {productId} = req.params;
      const file = req.file as MulterFile;
      const data = req.body;

      logDevJson(file)
      logDevJson(data)

      const product = await Product.findByPk(productId, {attributes: ['id', 'image']});

      const [,ext] = file.originalname.split('.');
      const filename = `${gerarHashEmail(`${product.id}`)}.${ext}`;

      await rename({caminhoAtual: file.path, novoNome: filename });

      const url = `midias/company${userReq.companyId}/product/${filename}`;

      product.image = url;
      await product.save();

      await ProductImage.create({
        companyId: userReq.companyId,
        productId: productId,
        name: data.originalName,
        size: file.size,
        url,
        mimetype: file.mimetype,
        width: data.width,
        height: data.height,
        isDefault: true,
        active: true,
      });

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async destroyImage (req: Request, res: Response): Promise<Response> {
    try {
      const {productId} = req.params;

      const product = await Product.findByPk(productId, {attributes: ['id', 'image']});

      await remove({caminho: product.image});

      product.image = null;
      await product.save();

      await ProductImage.destroy({where: {productId: productId, isDefault: true}, force: true});

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }
}

export default new ProductController();




