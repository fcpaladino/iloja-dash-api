import { Request, Response } from "express";
import { TryCatch } from "../../helpers/TryCatch";
import { HandlerError } from "../../errors/HandlerError";
import AppError from "../../errors/AppError";
import Company from "../../models/Company";
import CompanyUser from "../../models/UserCompany";
import Role from "../../models/Role";
import User from "../../models/User";
import { createJWT } from "../../utils/jwt";
import { encryptValue } from "../../utils/encryptDecrypt";

class CompanySwitchController {
  @TryCatch()
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const authUser = req.user as IReqUser;
      const companyId = Number(req.body.companyId);
      if (!companyId) throw new AppError("Empresa inválida.", 400);

      const membership = await CompanyUser.findOne({ where: { userId: Number(authUser.id), companyId, active: true } });
      if (!membership) throw new AppError("Usuário sem acesso a esta empresa.", 403);

      const [user, company, role] = await Promise.all([
        User.findByPk(Number(authUser.id)),
        Company.findByPk(companyId),
        Role.findByPk(membership.roleId),
      ]);
      if (!user || !company || !company.active) throw new AppError("Empresa não encontrada ou inativa.", 403);

      const payload = {
        name: encodeURI(user.name),
        username: encodeURI(user.username || ""),
        email: encodeURI(user.email),
        id: user.id,
        companyId: company.id,
        companyName: encodeURI(company.name),
        profilePicUrl: user.profilePicUrl,
        is2fa: user.is2fa,
        isMaster: company.isMaster,
        owner: membership.owner,
        roleId: membership.roleId,
        version: 1,
      };

      return res.json({
        access_token: createJWT(payload),
        userp: encryptValue(role?.permissions || ""),
        company: { id: company.id, name: company.name, roleId: membership.roleId, owner: membership.owner },
      });
    } catch (e) {
      return HandlerError(e, res);
    }
  }
}

export default new CompanySwitchController();
