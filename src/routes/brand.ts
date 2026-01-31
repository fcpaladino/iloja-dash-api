import express from "express";
import Controller from "../controllers/App/BrandController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/brand", isAuth, Controller.index);
route.get("/app/brand/lists", isAuth, Controller.lists);
route.get("/app/brand/:id", isAuth, Controller.show);
route.post("/app/brand", isAuth, Controller.store);
route.put("/app/brand/:id", isAuth, Controller.update);
route.delete("/app/brand/:ids", isAuth, Controller.destroy);

export default route;
