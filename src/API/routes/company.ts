import express from "express";

import Controller from "../controllers/CompanyController";
import {schemaValidate} from "../middleware/schemaValidate";

import tokenApiAuth from "../middleware/tokenApiAuth";
import {querySchema} from "../schemas/filter";


const route = express.Router();

route.get("/api/company/me",
  tokenApiAuth,
  // statusCompanyMiddleware,
  schemaValidate(querySchema, 'params'),
  Controller.show
);



export default route;
