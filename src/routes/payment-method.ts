import express from "express";
import Controller from "../controllers/App/PaymentMethodController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/payment-method", isAuth, Controller.index);
route.get("/app/payment-method/lists", isAuth, Controller.lists);
route.get("/app/payment-method/:id", isAuth, Controller.show);
route.post("/app/payment-method", isAuth, Controller.store);
route.put("/app/payment-method/:id", isAuth, Controller.update);
route.delete("/app/payment-method/:ids", isAuth, Controller.destroy);

export default route;
