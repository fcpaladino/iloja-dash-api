import express from "express";
import Controller from "../controllers/App/ProductStockController";
import isAuth from "../middleware/isAuth";

const route = express.Router();
route.get("/app/product-stock", isAuth, Controller.index);
route.post("/app/product-stock/adjust", isAuth, Controller.adjust);
route.get("/app/product-stock/:productId/history", isAuth, Controller.history);

export default route;
