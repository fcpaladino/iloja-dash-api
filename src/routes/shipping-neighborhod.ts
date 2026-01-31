import express from "express";
import Controller from "../controllers/App/ShippingNeighborhodController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/shipping-neighborhood", isAuth, Controller.index);
route.get("/app/shipping-neighborhood/lists", isAuth, Controller.lists);
route.get("/app/shipping-neighborhood/:id", isAuth, Controller.show);
route.post("/app/shipping-neighborhood", isAuth, Controller.store);
route.put("/app/shipping-neighborhood/:id", isAuth, Controller.update);
route.delete("/app/shipping-neighborhood/:ids", isAuth, Controller.destroy);

export default route;
