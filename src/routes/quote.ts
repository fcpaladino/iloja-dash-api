import express from "express";
import Controller from "../controllers/App/QuoteController";
import isAuth from "../middleware/isAuth";

const route = express.Router();
route.get("/app/quote", isAuth, Controller.index);
route.post("/app/quote", isAuth, Controller.store);
route.put("/app/quote/:id", isAuth, Controller.update);

export default route;
