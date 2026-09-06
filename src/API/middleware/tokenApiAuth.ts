import { Request, Response, NextFunction } from "express";
import Company from "../../models/Company";

const LOCAL_TENANTS = new Set(["localhost", "127.0.0.1", "::1"]);
const LOCAL_COMPANY_ID = 1;

function getSubdomain(req: Request) {
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "")
    .split(",")[0].trim().split(":")[0].toLowerCase();

  const xt = String(req.headers["x-tenant"] || "").toLowerCase();

  return xt || null;
}

const tokenApiAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const subdomain = getSubdomain(req);

    if (!subdomain) {
      throw new Error("Host inválido (precisa ser xxxxx.iloja.me)");
    }

    const company = LOCAL_TENANTS.has(subdomain)
      ? await Company.findByPk(LOCAL_COMPANY_ID, {
          attributes: ["id", "subdomain"],
        })
      : await Company.findOne({
          where: { subdomain },
          attributes: ["id", "subdomain"],
        });

    if (!company) {
      throw new Error("Empresa não encontrada para este subdomínio");
    }

    req.params = {
      ...req.params,
      companyId: String(company.id),
    };

    return next();

  } catch (error){
    throw new Error(`0. Acesso não permitido. ${error?.message ?? "Erro"}`);
  }
};

export default tokenApiAuth;
