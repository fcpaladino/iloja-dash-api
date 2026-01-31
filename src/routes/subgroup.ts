import express from "express";
import Controller from "../controllers/App/SubGroupController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/subgroup", isAuth, Controller.index);
route.get("/app/subgroup/lists", isAuth, Controller.lists);
route.get("/app/subgroup/:id", isAuth, Controller.show);
route.post("/app/subgroup", isAuth, Controller.store);
route.put("/app/subgroup/:id", isAuth, Controller.update);
route.delete("/app/subgroup/:ids", isAuth, Controller.destroy);

export default route;
