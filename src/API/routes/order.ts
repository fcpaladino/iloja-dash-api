import express from "express";

import Controller from "../controllers/OrderController";
import {schemaValidate} from "../middleware/schemaValidate";

import tokenApiAuth from "../middleware/tokenApiAuth";
import {idParamSchema, querySchema} from "../schemas/product";
// import statusCompanyMiddleware from "../../middleware/statusCompanyMiddleware";

const route = express.Router();

route.post("/api/order",
  tokenApiAuth,
  // statusCompanyMiddleware,
  // schemaValidate(querySchema, 'params'),
  Controller.store
);

export default route;
