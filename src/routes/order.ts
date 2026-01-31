import express from "express";
import Controller from "../controllers/App/OrderController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/order", isAuth, Controller.index);
route.get("/app/order/lists", isAuth, Controller.lists);
route.get("/app/order/:id", isAuth, Controller.show);
route.post("/app/order", isAuth, Controller.store);
route.put("/app/order/:id", isAuth, Controller.update);
route.delete("/app/order/:ids", isAuth, Controller.destroy);

export default route;
