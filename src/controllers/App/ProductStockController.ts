import { Request, Response } from "express";
import { Op } from "sequelize";
import Product from "../../models/Product";
import ProductStockMovement from "../../models/ProductStockMovement";

class ProductStockController {
  index = async (req: Request, res: Response) => {
    const user = req.user as IReqUser;
    const products = await Product.findAll({
      where: { companyId: user.companyId },
      attributes: ["id", "name", "ref", "sku", "stockCurrent", "inventoryControl", "active", "availability"],
      order: [["name", "ASC"]],
    });
    return res.json({ data: products });
  };

  adjust = async (req: Request, res: Response) => {
    const user = req.user as IReqUser;
    const product = await Product.findOne({ where: { id: req.body.productId, companyId: user.companyId } });
    if (!product) return res.status(404).json({ message: "Produto não encontrado." });

    const before = Number(product.stockCurrent || 0);
    const hasTarget = req.body.stockCurrent !== undefined && req.body.stockCurrent !== "";
    const after = hasTarget ? Number(req.body.stockCurrent) : before + Number(req.body.delta || 0);
    if (!Number.isFinite(after) || after < 0) return res.status(422).json({ message: "O estoque final deve ser um número maior ou igual a zero." });
    if (after === before) return res.status(422).json({ message: "Informe uma quantidade diferente do estoque atual." });

    await product.update({ stockCurrent: after });
    const movement = await ProductStockMovement.create({
      companyId: user.companyId,
      productId: product.id,
      userId: Number(user.id),
      quantityBefore: before,
      quantityAfter: after,
      quantityDelta: after - before,
      reason: String(req.body.reason || "Ajuste manual"),
      note: req.body.note || null,
    });
    return res.json({ data: { product: { ...product.toJSON(), ref: product.ref }, movement } });
  };

  history = async (req: Request, res: Response) => {
    const user = req.user as IReqUser;
    const product = await Product.findOne({ where: { id: req.params.productId, companyId: user.companyId }, attributes: ["id", "name", "ref", "stockCurrent"] });
    if (!product) return res.status(404).json({ message: "Produto não encontrado." });
    const history = await ProductStockMovement.findAll({ where: { companyId: user.companyId, productId: product.id }, order: [["createdAt", "DESC"]], limit: 100 });
    return res.json({ data: { product, history } });
  };
}

export default new ProductStockController();
