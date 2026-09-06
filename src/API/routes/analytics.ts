import {Router} from "express";
import Controller from "../controllers/AnalyticsController";
import tokenApiAuth from "../middleware/tokenApiAuth";
import isAuth from "../../middleware/isAuth";

const route = Router();

route.post("/api/analytics/product-event", tokenApiAuth, Controller.event);
route.post("/api/analytics/category-click", tokenApiAuth, Controller.event);
route.post("/api/analytics/category-view", tokenApiAuth, Controller.event);
route.post("/api/analytics/product-share", tokenApiAuth, Controller.event);
route.post("/api/analytics/add-to-cart", tokenApiAuth, Controller.event);
route.post("/api/analytics/banner-view", tokenApiAuth, Controller.event);
route.post("/api/analytics/banner-click", tokenApiAuth, Controller.event);
route.post("/api/analytics/banner-session", tokenApiAuth, Controller.event);
route.post("/api/analytics/banner-batch", tokenApiAuth, Controller.event);
route.get("/app/analytics", isAuth, Controller.overview);

export default route;
