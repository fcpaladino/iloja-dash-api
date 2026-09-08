import { Request, Response } from "express";
import { Op } from "sequelize";
import Company from "../models/Company";
import Product from "../models/Product";

const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);

function tenantFromRequest(req: Request) {
  const tenantHeader = String(req.headers["x-tenant"] || "").trim().toLowerCase();
  if (tenantHeader) return tenantHeader;
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim().split(":")[0].toLowerCase();
  if (localHosts.has(host)) return null;
  return host.split(".")[0] || null;
}

function publicBaseUrl(req: Request) {
  const configured = String(process.env.FRONTEND_URL || "").replace(/\/$/, "");
  if (configured) return configured;
  const protocol = String(req.headers["x-forwarded-proto"] || req.protocol || "https").split(",")[0];
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0];
  return `${protocol}://${host}`;
}

function absoluteMediaUrl(value: unknown, req: Request) {
  if (!value) return "";
  if (/^https?:\/\//i.test(String(value))) return String(value);
  const backend = String(process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
  return `${backend}/${String(value).replace(/^\//, "")}`;
}

function csvValue(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
}

function productLink(product: Product, company: Company, req: Request) {
  const tenant = company.subdomain || String(company.id);
  const prefix = `/${tenant}`;
  return `${publicBaseUrl(req)}${prefix}/produto/${product.slug || product.id}`;
}

async function findCompany(companyKey: string | undefined, req: Request) {
  const key = String(companyKey || tenantFromRequest(req) || "").trim().toLowerCase();
  if (!key) return null;
  const numericId = Number(key);
  return Company.findOne({
    where: Number.isInteger(numericId) && numericId > 0
      ? { id: numericId, active: true }
      : { subdomain: key, active: true },
  });
}

class FeedController {
  csv = async (req: Request, res: Response) => {
    const company = await findCompany(req.params.companyKey, req);
    if (!company) return res.status(404).send("Loja não encontrada.");

    const products = await Product.findAll({
      where: { companyId: company.id, active: true, includeInMetaFeed: true, [Op.or]: [{ availability: true }, { availability: null }] },
      order: [["id", "ASC"]],
    });
    const header = ["id", "title", "description", "availability", "condition", "price", "link", "image_link", "brand", "item_group_id"];
    const lines = products.map((product) => {
      const price = Number(product.pricePromotional || product.price || 0).toFixed(2);
      return [
        product.sku || product.ref || product.id,
        product.title || product.name,
        product.description || product.text || product.name,
        product.availability === false ? "out of stock" : "in stock",
        "new",
        `${price} BRL`,
        productLink(product, company, req),
        absoluteMediaUrl(product.image, req),
        company.name,
        product.ref || product.id,
      ].map(csvValue).join(",");
    });
    res.set({ "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "inline; filename=meta-products.csv", "Cache-Control": "public, max-age=300" });
    return res.send(`\uFEFF${[header.map(csvValue).join(","), ...lines].join("\n")}`);
  };
}

export default new FeedController();
