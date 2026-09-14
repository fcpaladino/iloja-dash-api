import { Request, Response } from "express";
import ProductInterestLead from "../../models/ProductInterestLead";
import Product from "../../models/Product";
import { HandlerError } from "../helpers/HandleErrors";

class ProductInterestLeadController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      const companyId = Number(req.params.companyId);
      const { productId, name, phone, email, message } = req.body || {};
      if (!productId || !String(name || '').trim() || !String(phone || '').trim()) {
        return res.status(400).json({ message: "Nome, telefone e produto são obrigatórios." });
      }
      const product = await Product.findOne({ where: { id: Number(productId), companyId }, attributes: ["id"] });
      if (!product) return res.status(404).json({ message: "Produto não encontrado." });
      const lead = await ProductInterestLead.create({ companyId, productId: Number(productId), name: String(name).trim(), phone: String(phone).trim(), email: email ? String(email).trim() : null, message: message ? String(message).trim() : null, status: "NEW" });
      return res.status(201).json({ data: { id: lead.id } });
    } catch (error) { return HandlerError(res, error, "Api.ProductInterestLead.create"); }
  }
}

export default new ProductInterestLeadController();
