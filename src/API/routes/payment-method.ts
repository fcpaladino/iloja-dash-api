import express from "express";

import Controller from "../controllers/PaymentMethodController";
import {schemaValidate} from "../middleware/schemaValidate";

import tokenApiAuth from "../middleware/tokenApiAuth";
import {idParamSchema, querySchema} from "../schemas/payment-method";
// import statusCompanyMiddleware from "../../middleware/statusCompanyMiddleware";

const route = express.Router();

route.get("/api/payment-method",
  tokenApiAuth,
  // statusCompanyMiddleware,
  schemaValidate(querySchema, 'params'),
  Controller.list
);



export default route;
