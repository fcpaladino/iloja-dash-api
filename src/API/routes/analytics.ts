import {Router} from "express";
import Controller from "../controllers/AnalyticsController";
import tokenApiAuth from "../middleware/tokenApiAuth";
import isAuth from "../../middleware/isAuth";
import analyticsRateLimit from "../../middleware/analyticsRateLimit";

const route = Router();

route.post("/api/analytics/event", tokenApiAuth, analyticsRateLimit, Controller.event);
route.post("/api/analytics/product-event", tokenApiAuth, analyticsRateLimit, Controller.event);
route.post("/api/analytics/category-click", tokenApiAuth, analyticsRateLimit, Controller.event);
route.post("/api/analytics/category-view", tokenApiAuth, analyticsRateLimit, Controller.event);
route.post("/api/analytics/product-share", tokenApiAuth, analyticsRateLimit, Controller.event);
route.post("/api/analytics/add-to-cart", tokenApiAuth, analyticsRateLimit, Controller.event);
route.post("/api/analytics/banner-view", tokenApiAuth, analyticsRateLimit, Controller.event);
route.post("/api/analytics/banner-click", tokenApiAuth, analyticsRateLimit, Controller.event);
route.post("/api/analytics/banner-session", tokenApiAuth, analyticsRateLimit, Controller.event);
route.post("/api/analytics/banner-batch", tokenApiAuth, analyticsRateLimit, Controller.event);
route.get("/app/analytics", isAuth, Controller.overview);

export default route;
