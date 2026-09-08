import express from "express";
import Controller from "../controllers/App/CashController";
import isAuth from "../middleware/isAuth";

const route = express.Router();
route.get("/app/cash", isAuth, Controller.index);
route.post("/app/cash/withdrawal", isAuth, Controller.withdrawal);
export default route;
