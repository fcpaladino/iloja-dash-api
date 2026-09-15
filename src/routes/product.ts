import express from "express";
import multer from "multer";
import Controller from "../controllers/App/ProductController";
import isAuth from "../middleware/isAuth";

import uploadConfig from "../config/uploadProduct";
import {analyzeProductImages, productAIUpload} from "../controllers/App/ProductAIController";
const upload = multer(uploadConfig);

const route = express.Router();

route.post("/products/ai/analyze", isAuth, productAIUpload.array("images", 4), analyzeProductImages);

route.get("/app/product", isAuth, Controller.index);
route.get("/app/product/lists", isAuth, Controller.lists);
route.get("/app/product/:id", isAuth, Controller.show);
route.post("/app/product", isAuth, Controller.store);
route.put("/app/product/:id", isAuth, Controller.update);
route.delete("/app/product/:ids", isAuth, Controller.destroy);

route.post("/app/product/image/:productId", isAuth, upload.single("file"), Controller.uploadImage);
route.delete("/app/product/image/:productId", isAuth, Controller.destroyImage);

export default route;
