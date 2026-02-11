import {Request, Response} from "express";
import {TryCatch} from "../../helpers/TryCatch";
import User from "../../models/User";
import {hash} from "bcryptjs";
import app from "../../config/app";
import recuperarSenha from "../../emails/recuperar-senha";
import sendEmail from "../../utils/sendEmail";
import { Op } from "sequelize";
import Company from "../../models/Company";
import PasswordRecovery from "../../models/PasswordRecovery";
import moment from "moment";
import {addHours} from "date-fns";
import {gerarCodigoUnico} from "../../utils/helpers";

class PasswordSendController {
  constructor() {
    this.store = this.store.bind(this);
  }

  @TryCatch()
  async store (req: Request, res: Response): Promise<Response> {

    const {email} = req.body;

    const user = await User.findOne({
      where:{
        email,
        active: true,
        deletedAt: {[Op.is]: null}
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Não foi possivel encontrar o seu cadastro. Entre em contato com a central.', success: false });
    }

    const company = await Company.findOne({
      where: {
        id: user.companyId
      }
    });

    if (company.active !== true) {
      return res.status(400).json({ message: 'Empresa está inativa.', success: false });
    }

    const buffer = Buffer.from(`${user.id}:${user.email}`, 'binary');
    const base64 = buffer.toString('base64');

    const token = await hash(`${user.id}:${user.email}`, 8);
    const validIn = addHours(moment().toDate(), 3);

    const code = String(gerarCodigoUnico());

    await PasswordRecovery.destroy({
      where: {email}
    });

    await PasswordRecovery.create({
      email,
      token,
      code,
      validIn
    });

    const link = `${app.frontUrl}/auth/password-reset/${`${base64}`}?hash=${token}`;

    await sendEmail({
      from: 'naoresponder@iloja.me',
      to: user.email,
      subject: 'Recuperação de senha',
      html: recuperarSenha()
        .replace(/{nomeCliente}/g, user.name)
        .replace(/{code}/g, code)
        .replace(/{link}/g, link),
    });

    return res.status(200).json({ message: 'Foi enviado um link no email, para recuperação da conta.', success: true });
  }

}

export default new PasswordSendController();



