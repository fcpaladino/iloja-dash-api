import express from "express";

import Controller from "../controllers/FilterController";
import {schemaValidate} from "../middleware/schemaValidate";

import tokenApiAuth from "../middleware/tokenApiAuth";
import {querySchema} from "../schemas/filter";


const route = express.Router();

route.get("/api/filters",
  tokenApiAuth,
  // statusCompanyMiddleware,
  schemaValidate(querySchema, 'params'),
  Controller.list
);



export default route;
