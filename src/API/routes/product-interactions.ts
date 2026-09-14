import {Router} from "express";
import Controller from "../controllers/ProductInteractionController";
import tokenApiAuth from "../middleware/tokenApiAuth";
import LeadController from "../controllers/ProductInterestLeadController";

const route = Router();
route.post("/api/product-interactions", tokenApiAuth, Controller.create);
route.get("/api/product-preferences/:productId", tokenApiAuth, Controller.preference);
route.put("/api/product-preferences/:productId", tokenApiAuth, Controller.setPreference);
route.get("/api/products/recommended", tokenApiAuth, Controller.recommended);
route.post("/api/product-interest-leads", tokenApiAuth, LeadController.create);
export default route;
