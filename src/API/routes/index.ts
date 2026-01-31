import {Router} from "express";
import product from "./product";
import filter from "./filter";
import deliveryType from "./delivery-type";
import paymentMethod from "./payment-method";
import order from "./order";
import company from "./company";
import contact from "./contact";


const routes = Router();

routes.use(product);
routes.use(filter);
routes.use(deliveryType);
routes.use(paymentMethod);
routes.use(order);
routes.use(company);
routes.use(contact);

export default routes;
