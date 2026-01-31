import express from "express";
import Controller from "../controllers/App/CouponController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/coupon", isAuth, Controller.index);
route.get("/app/coupon/lists", isAuth, Controller.lists);
route.get("/app/coupon/:id", isAuth, Controller.show);
route.post("/app/coupon", isAuth, Controller.store);
route.put("/app/coupon/:id", isAuth, Controller.update);
route.delete("/app/coupon/:ids", isAuth, Controller.destroy);

export default route;
