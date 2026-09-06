import {Router} from "express";
import Controller from "../controllers/ShippingNeighborhoodController";
import tokenApiAuth from "../middleware/tokenApiAuth";

const route = Router();

route.get("/api/delivery/neighborhoods", tokenApiAuth, Controller.list);

export default route;
