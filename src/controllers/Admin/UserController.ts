import {Request, Response} from "express";
import User from "../../models/User";
import {yup} from "../../utils/yup";
import {HandlerError} from "../../errors/HandlerError";
import {responseSuccess} from "../../helpers/response";
import {whereSearch} from "../../database/sequelizeExtension";
import {gerarHashEmail, getFLNames} from "../../utils/helpers";
import { File as MulterFile } from 'multer';
import {remove, rename} from "../../utils/file";
import ValidateField from "../../services/ValidateField";
import { TryCatch } from '../../helpers/TryCatch';
import {Op} from "sequelize";

const validateForm = async (data: IUserItem, id: number | null = null) => {
  const schema = yup.object().shape({
    firstname: yup.string().required(),
    lastname: yup.string().required(),
    email: yup.string().required(),
    active: yup.boolean().required(),
    roleId: yup.number(),
  });
  await schema.validate(data, { abortEarly: false });
};

class UserController {
  constructor() {
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
    this.uploadProfilePicUrl = this.uploadProfilePicUrl.bind(this);
    this.destroyProfilePicUrl = this.destroyProfilePicUrl.bind(this);
    this.email = this.email.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  @TryCatch()
  async index (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {search, page, orderBy, status, role} = req.query as FiltersQuery;
      const order: any = orderBy ? orderBy?.map(item => [String(item.name), String(item.order)]) : [["name", "asc"]];

      // orderBy?.map(item => [String(item.name), String(item.order)])

      const conditions = [
        whereSearch('companyId', '=', user.companyId),
        whereSearch('roleId', '=', role),
        whereSearch('active', 'bool', status),
        whereSearch('name', 'like', search),
      ].filter(Boolean);

      const where = conditions.length > 0 ? { [Op.and]: conditions } : {};

      const items = await User.paginate(user.companyId, {
        page,
        where: where,
        order: order,
        attributes: ['id', 'name', 'email', 'active', 'roleId', 'profilePicUrl'],
      });

      return res.json({data: items.items, meta: items.meta});

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async show(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {id} = req.params;

      const item = await User.findByPk(id, {
        attributes: ['id', 'name', 'email', 'username', 'roleId', 'phone', 'profilePicUrl', 'active', 'createdAt', 'updatedAt'],
      });

      return res.json({
        data: {
          ...item.dataValues,
          ...getFLNames(item.name),
          profilePicUrl: item.profilePicUrl ? `${item.profilePicUrl}` : null
        }
      });

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async store (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const data = req.body as IUserItem;

      await ValidateField({model: User, field: 'email', value: data.email.trim(), messageError: 'E-mail já em uso.'});
      // await ValidateField({model: User, field: 'username', value: data.username.trim(), messageError: 'Usuário já em uso.'});

      data.name = `${data.firstname} ${data.lastname}`;
      data.companyId = user.companyId;

      const item = await User.create(data);

      return res.json(responseSuccess({item}));

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async update (req: Request, res: Response): Promise<Response> {

    const user = req.user as IReqUser;
    const {id} = req.params;
    const data = req.body as IUserItem;

    data.name = `${data.firstname} ${data.lastname}`;

    await ValidateField({model: User, field: 'email', value: data.email.trim(), id, messageError: 'E-mail já em uso.'});
    // await ValidateField({model: User, field: 'username', value: data.username.trim(), id, messageError: 'Usuário já em uso.'});

    const item = await User.findByPk(id);

    await item.update(data);

    return res.json({item});
  }

  @TryCatch()
  async destroy (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {ids} = req.params;

      for (const id of ids.split(';')) {
        await User.destroy({ where: { id } });
      }

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async uploadProfilePicUrl (req: Request, res: Response): Promise<Response> {
    try {
      const userReq = req.user as IReqUser;
      const {userId} = req.params;
      const file = req.file as MulterFile;

      const user = await User.findByPk(userId, {attributes: ['id', 'email', 'profilePicUrl']});

      const [,ext] = file.originalname.split('.');
      const filename = `${gerarHashEmail(user.email)}.${ext}`;

      await rename({caminhoAtual: file.path, novoNome: filename });

      user.profilePicUrl = `midias/company${userReq.companyId}/${filename}`;
      await user.save();

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async destroyProfilePicUrl (req: Request, res: Response): Promise<Response> {
    try {
      const {userId} = req.params;

      const user = await User.findByPk(userId, {attributes: ['id', 'email', 'profilePicUrl']});

      await remove({caminho: user.profilePicUrl});

      user.profilePicUrl = null;
      await user.save();

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async email (req: Request, res: Response): Promise<Response> {
    try {
      // const {id:userId} = req.user;
      //
      // const user = await User.findByPk(userId);
      //
      // const buffer = Buffer.from(`${user.id}:${user.email}`, 'binary');
      // const base64 = buffer.toString('base64');
      //
      // const token = await hash(`${user.id}:${user.email}`, 8);
      // // const validIn = addHours(moment().toDate(), 3);
      //
      // const link = `${app.frontUrl}/auth/password-reset/${`${base64}`}?hash=${token}`;
      //
      // console.log('link', link);
      //
      // const bodyHtml2 = recuperarSenha().replace(/{nomeCliente}/g, 'Filipe Paladino').replace(/{link}/g, link);
      //
      // const disparo2 = await sendEmail({
      //   from: 'conta@wachat.app.br',
      //   to: 'filipe237@gmail.com',
      //   subject: 'Recuperação de senha',
      //   html: bodyHtml2,
      // });

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async changePassword (req: Request, res: Response): Promise<Response> {
    try {
      const {id} = req.params;
      const data = req.body as IUserChangePassword;

      const user = await User.findByPk(id);

      user.password = data.password;
      await user.save();

      return res.end();

    } catch (e) {
      console.log(e);
      return HandlerError(e, res);
    }
  }

}

export default new UserController();




