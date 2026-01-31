import {Response} from "express";

const responseSuccess = (res: Response, data = [], paginate = null, sourceDb = 'database') => {
  return res.status(200).json({
    status: "success",
    data: data,
    meta: (paginate === null ? undefined : paginate),
    sourceDb
  });
};

export default responseSuccess;
