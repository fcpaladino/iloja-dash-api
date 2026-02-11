import {Request, Response} from "express";
import {TryCatch} from "../../helpers/TryCatch";
import {compare} from "bcryptjs";
import User from "../../models/User";
import PasswordRecovery from "../../models/PasswordRecovery";
import moment from "moment";

class PasswordResetController {
  constructor() {
    this.store = this.store.bind(this);
  }

  @TryCatch()
  async store (req: Request, res: Response): Promise<Response> {
    try {
      const {hash, token, password} = req.body;

      const base64 = String(token).replace(/-/g, '+').replace(/_/g, '/');
      const decodedText = atob(base64);

      const isTokenValid = await compare(decodedText, hash);
      if(!isTokenValid){
        return res.status(400).json({message: 'Esse link não é válido. Refaça a solicitação.', success: false, refazer: true});
      }

      const [userId, userEmail] = decodedText.split(':');

      // console.log('decodedText', decodedText);
      // console.log('token', token);

      const dbpass = await PasswordRecovery.findOne({
        where: {
          email: userEmail,
          token: hash
        }
      });

      if (!dbpass) {
        return res.status(400).json({ message: 'Esse link não é mais válido. Refaça a solicitação.', success: false, refazer: true });
      }

      const banco = moment(dbpass.validIn).format('YYYY-MM-DD HH:mm:ss');
      const atual = moment().format('YYYY-MM-DD HH:mm:ss');

      if (!(atual <= banco)) {
        await dbpass.destroy();
        return res.status(400).json({ message: 'Não foi possivel concluir a alteração de senha. Refaça a operação', success: false });
      }


      const user = await User.findOne({
        where:{
          id: userId,
          email: userEmail
        }
      });

      if(!user){
        return res.status(400).json({message: 'Não foi possivel encontrar o seu cadastro. Entre em contato com o suporte.', success: false});
      }

      await user.update({
        password
      });

      await PasswordRecovery.destroy({
        where: {email: user.email}
      });

      return res.status(200).json();
    } catch (e) {
      console.log(e);
      return res.status(500).json();
    }
  }

}

export default new PasswordResetController();



