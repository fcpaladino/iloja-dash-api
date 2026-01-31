import express from "express";

import Controller from "../controllers/ContactController";
import {schemaValidate} from "../middleware/schemaValidate";

import tokenApiAuth from "../middleware/tokenApiAuth";
import {querySchema} from "../schemas/filter";


const route = express.Router();

route.get("/api/contact",
  tokenApiAuth,
  // statusCompanyMiddleware,
  schemaValidate(querySchema, 'params'),
  Controller.store
);



export default route;
