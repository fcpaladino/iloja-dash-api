import express from "express";
import Controller from "../controllers/App/ShippingRuleController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/shipping-rule", isAuth, Controller.index);
route.get("/app/shipping-rule/lists", isAuth, Controller.lists);
route.get("/app/shipping-rule/:id", isAuth, Controller.show);
route.post("/app/shipping-rule", isAuth, Controller.store);
route.put("/app/shipping-rule/:id", isAuth, Controller.update);
route.delete("/app/shipping-rule/:ids", isAuth, Controller.destroy);

export default route;
