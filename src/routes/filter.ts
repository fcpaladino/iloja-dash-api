import express from "express";
import Controller from "../controllers/App/FilterController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/filter", isAuth, Controller.index);
route.get("/app/filter/lists", isAuth, Controller.lists);
route.get("/app/filter/:id", isAuth, Controller.show);
route.post("/app/filter", isAuth, Controller.store);
route.put("/app/filter/:id", isAuth, Controller.update);
route.delete("/app/filter/:ids", isAuth, Controller.destroy);

export default route;
