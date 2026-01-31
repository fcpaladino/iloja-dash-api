import express from "express";
import Controller from "../controllers/App/ShippingCepController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/app/shipping-cep", isAuth, Controller.index);
route.get("/app/shipping-cep/lists", isAuth, Controller.lists);
route.get("/app/shipping-cep/:id", isAuth, Controller.show);
route.post("/app/shipping-cep", isAuth, Controller.store);
route.put("/app/shipping-cep/:id", isAuth, Controller.update);
route.delete("/app/shipping-cep/:ids", isAuth, Controller.destroy);

export default route;
