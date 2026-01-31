import express from "express";
import multer from "multer";
import Controller from "../controllers/Admin/CompanyController";
import isAuth from "../middleware/isAuth";
import {yupValidate} from "../middleware/yupValidate";
import {company, global} from "../schemas";

import uploadConfig from "../config/uploadConfig";
const upload = multer(uploadConfig);

const route = express.Router();

route.get("/admin/company", isAuth, Controller.index);

route.get("/admin/company/:id", isAuth, yupValidate(global.idParamSchema, 'params'), Controller.show);

route.post("/admin/company", isAuth, yupValidate(company.storeSchema), Controller.store);

route.put("/admin/company/:id", isAuth, yupValidate(global.idParamSchema, 'params'), yupValidate(company.updateSchema), Controller.update);

route.delete("/admin/company/:ids", isAuth, yupValidate(global.idsParamSchema, 'params'), Controller.destroy);


route.post("/admin/company/logotipo/:companyId", isAuth, upload.single("file"), Controller.uploadLogotipo);
route.delete("/admin/company/logotipo/:companyId", isAuth, Controller.destroyLogotipo);
export default route;
