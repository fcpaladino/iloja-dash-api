import express from "express";
import Controller from "../controllers/App/DeliveryTypeController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/delivery-type", isAuth, Controller.index);
route.get("/app/delivery-type/lists", isAuth, Controller.lists);
route.get("/app/delivery-type/:id", isAuth, Controller.show);
route.post("/app/delivery-type", isAuth, Controller.store);
route.put("/app/delivery-type/:id", isAuth, Controller.update);
route.delete("/app/delivery-type/:ids", isAuth, Controller.destroy);

export default route;
