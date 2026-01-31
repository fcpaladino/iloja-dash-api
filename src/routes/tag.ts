import express from "express";
import Controller from "../controllers/App/TagController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/tag", isAuth, Controller.index);
route.get("/app/tag/lists", isAuth, Controller.lists);
route.get("/app/tag/:id", isAuth, Controller.show);
route.post("/app/tag", isAuth, Controller.store);
route.put("/app/tag/:id", isAuth, Controller.update);
route.delete("/app/tag/:ids", isAuth, Controller.destroy);

export default route;
