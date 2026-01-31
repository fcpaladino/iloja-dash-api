import express from "express";
import Controller from "../controllers/App/GroupController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/group", isAuth, Controller.index);
route.get("/app/group/lists", isAuth, Controller.lists);
route.get("/app/group/:id", isAuth, Controller.show);
route.post("/app/group", isAuth, Controller.store);
route.put("/app/group/:id", isAuth, Controller.update);
route.delete("/app/group/:ids", isAuth, Controller.destroy);

export default route;
