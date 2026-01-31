import {Response} from "express";

const responseValidate = (res: Response, error:string = '', extras:any = {}) => {
  return res.status(400).json({
    status: "validation",
    error: error,
    ...extras,
  });
};

export default responseValidate;
