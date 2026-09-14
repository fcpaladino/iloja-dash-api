import { Request, Response } from "express";
import { Op } from "sequelize";
import { HandlerError } from "../../errors/HandlerError";
import { TryCatch } from "../../helpers/TryCatch";
import { responseSuccess } from "../../helpers/response";
import { slugify } from "../../helpers/slugify";
import ProductField from "../../models/ProductField";
import Product from "../../models/Product";

const normalize = (data: any) => ({
  name: String(data.name || "").trim(),
  slug: slugify(String(data.slug || data.name || "").trim()),
  type: ["text", "number", "select", "multiselect", "boolean"].includes(data.type) ? data.type : "text",
  options: Array.isArray(data.options) ? data.options.filter(Boolean).map(String) : [],
  isFilter: Boolean(data.isFilter),
  active: data.active !== false,
  order: Number(data.order || 0),
});

class ProductFieldController {
  @TryCatch()
  async index(req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;
    const items = await ProductField.findAll({
      where: { companyId: user.companyId },
      order: [["order", "ASC"], ["name", "ASC"]],
    });
    return res.json({ data: items });
  }

  @TryCatch()
  async lists(req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;
    const items = await ProductField.findAll({ where: { companyId: user.companyId, active: true }, order: [["order", "ASC"], ["name", "ASC"]] });
    return res.json({ data: items });
  }

  @TryCatch()
  async store(req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;
    const data = normalize(req.body);
    if (!data.name || !data.slug) return res.status(422).json({ message: "Nome do campo é obrigatório." });
    const item = await ProductField.create({ ...data, companyId: user.companyId } as any);

    // Mantém o novo campo disponível em todos os produtos já existentes da empresa.
    const products = await Product.findAll({ where: { companyId: user.companyId } });
    await Promise.all(products.map((product) => product.update({
      customFields: { ...(product.customFields || {}), [item.slug]: null },
    })));

    return res.json(responseSuccess({ item }));
  }

  @TryCatch()
  async update(req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;
    const item = await ProductField.findOne({ where: { id: req.params.id, companyId: user.companyId } });
    if (!item) return res.status(404).json({ message: "Campo extra não encontrado." });
    const nextData = normalize(req.body);
    const previousSlug = item.slug;
    await item.update(nextData);

    if (previousSlug !== nextData.slug) {
      const products = await Product.findAll({ where: { companyId: user.companyId } });
      await Promise.all(products.map((product) => {
        const customFields = { ...(product.customFields || {}) };
        if (Object.prototype.hasOwnProperty.call(customFields, previousSlug)) {
          customFields[nextData.slug] = customFields[previousSlug];
          delete customFields[previousSlug];
        } else if (!Object.prototype.hasOwnProperty.call(customFields, nextData.slug)) {
          customFields[nextData.slug] = null;
        }
        return product.update({ customFields });
      }));
    }
    return res.json(responseSuccess({ item }));
  }

  @TryCatch()
  async destroy(req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;
    await ProductField.destroy({ where: { id: { [Op.in]: String(req.params.ids).split(";") }, companyId: user.companyId } });
    return res.end();
  }
}

export default new ProductFieldController();
