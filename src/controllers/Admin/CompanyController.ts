import {Request, Response} from "express";
import Company from "../../models/Company";
import {HandlerError} from "../../errors/HandlerError";
import {responseSuccess} from "../../helpers/response";
import {whereSearch} from "../../database/sequelizeExtension";
import {TryCatch} from "../../helpers/TryCatch";
import ValidateField from "../../services/ValidateField";
import User from "../../models/User";
import Plan from "../../models/Plan";
import Role from "../../models/Role";
import {permissionsDefaultAdmin} from "../../db/permissions";
import {createUsernameByEmail, gerarHashEmail} from "../../utils/helpers";
import Product from "../../models/Product";
import {remove, rename} from "../../utils/file";
import { File as MulterFile } from 'multer';
import DeliveryType from "../../models/DeliveryType";

class CompanyController {
  constructor() {
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.store = this.store.bind(this);
    this.update = this.update.bind(this);
    this.destroy = this.destroy.bind(this);
    this.uploadLogotipo = this.uploadLogotipo.bind(this);
    this.destroyLogotipo = this.destroyLogotipo.bind(this);
  }

  @TryCatch()
  async index (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {search, page, orderBy, status} = req.query as FiltersQuery;
      const order: any = orderBy ? orderBy?.map(item => [String(item.name), String(item.order)]) : [["name", "asc"]];

      // orderBy?.map(item => [String(item.name), String(item.order)])

      const where = {
        ...whereSearch('name', 'like', search),
        // ...whereSearch('active', 'bool', status),
      };

      const items = await Company.paginate(user.companyId, {
        page,
        where: where,
        order: order,
      });

      return res.json({data: items.items, meta: items.meta});

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async show (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {id} = req.params;

      const item: ICompanyItem = await Company.findByPk(id);

      return res.json({data: item});

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async store (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const data = req.body as ICompanyItem;

      await ValidateField({model: User, field: 'email', value: data.email.trim(), messageError: 'E-mail já em uso.'});
      await ValidateField({model: Company, field: 'email', value: data.email.trim(), messageError: 'E-mail já em uso.'});

      // const plan = await Plan.create({name: `Plan: ${data.name}`});
      // data.planId = plan.id;

      const item = await Company.create(data);

      const roleCompany = await Role.create({
        name: `Administrador`,
        permissions: permissionsDefaultAdmin(),
        companyId: item.id,
      });

      const userCompany = await User.create({
        name: item.name,
        email: item.email,
        username: createUsernameByEmail(item.email),
        companyId: item.id,
        roleId: roleCompany.id,
        emailVerifiedAt: new Date(),
        password: data.password || 'secret@!!',
        owner: true,
        active: true
      });


      return res.json(responseSuccess({item}));

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async update (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {id} = req.params;
      const data = req.body as ICompanyItem;

      if(data?.email) {
        await ValidateField({
          model: Company,
          field: 'email',
          value: data.email.trim(),
          messageError: 'E-mail já em uso.',
          id
        });
      }

      if(data?.password) {

        const userOwner = await User.findOne({
          where:{
            companyId: user.companyId,
            owner: true,
          }
        });
        if(userOwner){
          userOwner.password = data.password;
          await userOwner.save();
        }
        delete data.password;
      }

      const item = await Company.findByPk(id);

      await item.update(data);

      return res.json({item});

    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async destroy (req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as IReqUser;
      const {ids} = req.params;

      for (const id of ids) {
        await Company.destroy({ where: { id } });
      }

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }



  @TryCatch()
  async uploadLogotipo (req: Request, res: Response): Promise<Response> {
    try {
      const userReq = req.user as IReqUser;
      const {companyId} = req.params;
      const file = req.file as MulterFile;

      const item = await Company.findByPk(companyId, {attributes: ['id', 'logotipo']});

      const [,ext] = file.originalname.split('.');
      const filename = `${gerarHashEmail(`${item.id}`)}.${ext}`;

      await rename({caminhoAtual: file.path, novoNome: filename });

      item.logotipo = `midias/company${companyId}/config/${filename}`;
      await item.save();

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }

  @TryCatch()
  async destroyLogotipo (req: Request, res: Response): Promise<Response> {
    try {
      const {companyId} = req.params;

      const item = await Company.findByPk(companyId, {attributes: ['id', 'logotipo']});

      await remove({caminho: item.logotipo});

      item.logotipo = null;
      await item.save();

      return res.end();
    } catch (e) {
      return HandlerError(e, res);
    }
  }

}

export default new CompanyController();


