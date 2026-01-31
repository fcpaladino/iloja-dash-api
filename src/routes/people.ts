import express from "express";
import Controller from "../controllers/App/PeopleController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/people", isAuth, Controller.index);
route.get("/app/people/:id", isAuth, Controller.show);
route.post("/app/people", isAuth, Controller.store);
route.put("/app/people/:id", isAuth, Controller.update);
route.delete("/app/people/:ids", isAuth, Controller.destroy);

export default route;
