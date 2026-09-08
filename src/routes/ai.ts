import express from "express";
import isAuth from "../middleware/isAuth";
import {aiCreditsWebhookController, createAiCreditOrderController, generateCompanySeoController, generateProductDescriptionController, generateProductSeoController, getAiCreditsController, listAiCreditOrdersController} from "../controllers/AiController";

const route = express.Router();
route.get("/api/ai-credits", isAuth, getAiCreditsController);
route.get("/api/ai-credit-orders", isAuth, listAiCreditOrdersController);
route.post("/api/ai-credit-orders", isAuth, createAiCreditOrderController);
route.post("/api/asaas/webhook", aiCreditsWebhookController);
route.post("/app/product/generate-description", isAuth, generateProductDescriptionController);
route.post("/app/product/generate-seo", isAuth, generateProductSeoController);
route.post("/admin/company/generate-seo", isAuth, generateCompanySeoController);
export default route;
