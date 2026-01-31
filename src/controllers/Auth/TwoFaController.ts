import {Request, Response} from "express";
import {TryCatch} from "../../helpers/TryCatch";
import User from "../../models/User";
import {decryptValue, encryptValue} from "../../utils/encryptDecrypt";
import app from "../../config/app";

class TwoFaController {
  constructor() {
    this.generate = this.generate.bind(this);
    this.validate = this.validate.bind(this);
    this.remove = this.remove.bind(this);
  }

  @TryCatch()
  async generate (req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;

    const QRCode = require('qrcode');
    const otplib = require('otplib');

    const register = await User.findByPk(user.id);

    const secret = otplib.authenticator.generateSecret();

    const otpauthUrl = otplib.authenticator.keyuri(register.email, app.nameApp, secret);

    const qrCode = await QRCode.toDataURL(otpauthUrl);

    register.token2fa = encryptValue(secret);
    await register.save();

    return res.status(200).json({
      qrcode: qrCode
    });

  }

  @TryCatch()
  async validate (req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;
    const { code } = req.body;

    const register = await User.findByPk(user.id);

    const otplib = require('otplib');

    const userToken = decryptValue(register.token2fa);

    const valid = otplib.authenticator.check(code, userToken);

    register.is2fa = valid;
    await register.save();

    return res.status(200).json({
      valid: valid
    });
  }


  @TryCatch()
  async remove (req: Request, res: Response): Promise<Response> {
    const user = req.user as IReqUser;

    const register = await User.findByPk(user.id);

    register.token2fa = null;
    register.is2fa = false;
    await register.save();

    return res.status(200).json({});
  }

}

export default new TwoFaController();



