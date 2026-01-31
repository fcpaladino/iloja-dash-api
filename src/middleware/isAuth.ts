import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import AppError from "../errors/AppError";
import authConfig from "../config/auth";
import app from "../config/app";
import UserSession from "../models/UserSession";


type TokenPayload = IUserToken & {
  iat: number;
  exp: number;
}

const isAuth = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  const sessionId = req.headers['x-session-id'];

  // @ts-ignore
  const agent = req.useragent;
  const envDev = app.env === "dev";

  // const session = await UserSession.findOne({ where:{uuid: sessionId}, attributes:['id'] });

  // if(!session?.id) {
  //   return next(new AppError("[-1] Não autenticado.", 401));
  // }

  if (
    (!envDev) && agent.isAuthoritative === false ||
    (!envDev) && (agent.isBot !== false || agent.isCurl !== false || agent.os === "unknown") ||
    !authHeader
  ) {
    return next(new AppError("[04] Não autenticado.", 401));
  }

  try {
    const [, token] = authHeader.split(" ");
    const decoded: TokenPayload = verify(token, authConfig.secret);

    if(!token){ throw new AppError("[05] Não autenticado.", 401); }

    if(!decoded.version){ throw new AppError("[06] Não autenticado.", 401); }

    if(decoded.version <= 0) { throw new AppError("[10] Não autenticado.", 401); }

    req.user = {...decoded};

  } catch (err) {
    throw new AppError(err?.message, 401);
  }

  return next();
};

export default isAuth;
