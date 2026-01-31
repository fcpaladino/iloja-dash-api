import express from "express";

import Controller from "../controllers/DeliveryTypeController";
import {schemaValidate} from "../middleware/schemaValidate";

import tokenApiAuth from "../middleware/tokenApiAuth";
import {idParamSchema, querySchema} from "../schemas/delivery-type";
// import statusCompanyMiddleware from "../../middleware/statusCompanyMiddleware";

const route = express.Router();

route.get("/api/delivery-type",
  tokenApiAuth,
  // statusCompanyMiddleware,
  schemaValidate(querySchema, 'params'),
  Controller.list
);



export default route;
