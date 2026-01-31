import express from "express";
import Controller from "../controllers/App/CategoryController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/category", isAuth, Controller.index);
route.get("/app/category/lists", isAuth, Controller.lists);
route.get("/app/category/:id", isAuth, Controller.show);
route.post("/app/category", isAuth, Controller.store);
route.put("/app/category/:id", isAuth, Controller.update);
route.delete("/app/category/:ids", isAuth, Controller.destroy);

export default route;
