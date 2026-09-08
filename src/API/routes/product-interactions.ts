import {Router} from "express";
import Controller from "../controllers/ProductInteractionController";
import tokenApiAuth from "../middleware/tokenApiAuth";

const route = Router();
route.post("/api/product-interactions", tokenApiAuth, Controller.create);
route.get("/api/product-preferences/:productId", tokenApiAuth, Controller.preference);
route.put("/api/product-preferences/:productId", tokenApiAuth, Controller.setPreference);
route.get("/api/products/recommended", tokenApiAuth, Controller.recommended);
export default route;
