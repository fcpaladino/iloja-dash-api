import {Response} from "express";

const responseError = (res: Response, error:string = '', code:number = 500, extras:any = {}) => {
  return res.status(code).json({
    status: "error",
    error: error,
    ...extras
  });
};

export default responseError;
