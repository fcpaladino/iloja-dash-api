import express from "express";
import Controller from "../controllers/App/ReceivableController";
import isAuth from "../middleware/isAuth";

const route = express.Router();
route.get("/app/receivable", isAuth, Controller.index);
route.get("/app/receivable/:id", isAuth, Controller.show);
route.post("/app/receivable", isAuth, Controller.store);
route.post("/app/receivable/:id/payment", isAuth, Controller.pay);
export default route;
