import express from "express";
import Controller from "../controllers/PointsController";
import tokenApiAuth from "../middleware/tokenApiAuth";

const route = express.Router();
route.get("/api/points/balance", tokenApiAuth, Controller.balance);
route.post("/api/points/exchange", tokenApiAuth, Controller.exchange);
export default route;
