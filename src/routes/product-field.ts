import express from "express";
import isAuth from "../middleware/isAuth";
import Controller from "../controllers/App/ProductFieldController";

const route = express.Router();
route.get("/app/product-field", isAuth, Controller.index);
route.get("/app/product-field/lists", isAuth, Controller.lists);
route.post("/app/product-field", isAuth, Controller.store);
route.put("/app/product-field/:id", isAuth, Controller.update);
route.delete("/app/product-field/:ids", isAuth, Controller.destroy);
export default route;
