import express from "express";

import Controller from "../controllers/ProductController";
import {schemaValidate} from "../middleware/schemaValidate";

import tokenApiAuth from "../middleware/tokenApiAuth";
import {idParamSchema, querySchema} from "../schemas/product";
// import statusCompanyMiddleware from "../../middleware/statusCompanyMiddleware";

const route = express.Router();

route.get("/api/products",
  tokenApiAuth,
  // statusCompanyMiddleware,
  schemaValidate(querySchema, 'params'),
  Controller.list
);

route.get("/api/products/:id",
  tokenApiAuth,
  // statusCompanyMiddleware,
  schemaValidate(idParamSchema, 'params'),
  Controller.show
);


export default route;
