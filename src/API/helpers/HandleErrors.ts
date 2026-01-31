import {Response} from "express";
import AppError from "../../errors/AppError";
import responseError from "../responses/responseError";

export const HandlerError = (res: Response, error:any, funcName = null, extras = {})=> {

  if (error.name === 'ValidationError') {
    let errortxt = 'Erro de validação';
    if(error.inner && Array.isArray(error.inner) && error.inner.length > 0) {
      errortxt = error.inner[0].message;
    }
    return responseError(res, errortxt, 400);
  }

  if(error instanceof AppError) {
    return responseError(res, error.message, error.statusCode, {errors: error.errors});
  }

  return responseError(res, 'Erro interno do servidor');
}
