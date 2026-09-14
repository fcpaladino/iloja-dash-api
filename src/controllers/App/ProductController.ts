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
    this.destroyGalleryImage = this.destroyGalleryImage.bind(this);
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
        attributes: ['id', 'name', 'active', 'availability', 'includeInMetaFeed', 'price', 'pricePromotional', 'point', 'allowPoints', 'pointsEarn', 'pointsCost', 'pointsOnly', 'pointsAndMoney', 'isNew', 'isPopular', 'isPromotional', 'ref', 'image'],
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
        where: {companyId: user.companyId, active: true},
        attributes: ['id', 'name', 'categoryId', 'price', 'pricePromotional', 'point', 'allowPoints', 'pointsEarn', 'pointsCost', 'pointsOnly', 'pointsAndMoney', 'isPromotional', 'ref', 'sku', 'image']
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

      const item = await Product.findOne({ where: { id, companyId: user.companyId } });

      const images = await ProductImage.findAll({
        where: { productId: id, companyId: user.companyId, isDefault: false, active: true },
        order: [['order', 'ASC'], ['id', 'ASC']],
      });

      return res.json(responseSuccess({
        ...item.dataValues,
        image: item.image? `${item.image}` : null,
        images: images.map((image) => ({
          ...image.dataValues,
          url: image.url?.includes('://') ? image.url : `${process.env.BACKEND_URL}/${image.url}`,
        })),
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

      const product = await Product.findByPk(productId, {attributes: ['id', 'image', 'companyId']});

      if (!product || product.companyId !== userReq.companyId) return res.status(404).end();

      const [,ext] = file.originalname.split('.');
      const filename = `${gerarHashEmail(`${product.id}`)}.${(ext || 'jpg').toLowerCase()}`;

      const isDefault = String(data.isDefault) !== 'false';

      if (isDefault && product.getDataValue('image')) {
        await remove({caminho: product.getDataValue('image')});
        await ProductImage.destroy({where: {productId, companyId: userReq.companyId, isDefault: true}, force: true});
      }

      await rename({caminhoAtual: file.path, novoNome: filename });

      const url = `midias/company${userReq.companyId}/product/${filename}`;

      if (isDefault) {
        product.image = url;
        await product.save();
      }

      await ProductImage.create({
        companyId: userReq.companyId,
        productId: productId,
        name: data.originalName,
        size: file.size,
        url,
        mimetype: file.mimetype,
        width: data.width,
        height: data.height,
        isDefault,
        active: true,
        order: isDefault ? 0 : (await ProductImage.count({where: {productId, companyId: userReq.companyId, isDefault: false}}) + 1),
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

      const userReq = req.user as IReqUser;
      const product = await Product.findOne({where: {id: productId, companyId: userReq.companyId}, attributes: ['id', 'image']});

      if (!product) return res.status(404).end();

      await remove({caminho: product.image});

      product.image = null;
      await product.save();

      await ProductImage.destroy({where: {productId: productId, isDefault: true}, force: true});

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async destroyGalleryImage (req: Request, res: Response): Promise<Response> {
    const userReq = req.user as IReqUser;
    const {productId, imageId} = req.params;
    const image = await ProductImage.findOne({where: {id: imageId, productId, companyId: userReq.companyId, isDefault: false}});

    if (!image) return res.status(404).end();

    await remove({caminho: image.url});
    await image.destroy({force: true});
    return res.end();
  }
}

export default new ProductController();




