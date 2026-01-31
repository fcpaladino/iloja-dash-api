import express from "express";
import Controller from "../controllers/App/StatusController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/status", isAuth, Controller.index);
route.get("/app/status/:id", isAuth, Controller.show);
route.post("/app/status", isAuth, Controller.store);
route.put("/app/status/:id", isAuth, Controller.update);
route.delete("/app/status/:ids", isAuth, Controller.destroy);

export default route;
