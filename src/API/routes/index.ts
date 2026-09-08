import {Router} from "express";
import product from "./product";
import filter from "./filter";
import deliveryType from "./delivery-type";
import paymentMethod from "./payment-method";
import order from "./order";
import company from "./company";
import contact from "./contact";
import analytics from "./analytics";
import shippingNeighborhood from "./shipping-neighborhood";
import productInteractions from "./product-interactions";
import points from "./points";


const routes = Router();

routes.use(productInteractions);
routes.use(points);
routes.use(product);
routes.use(filter);
routes.use(deliveryType);
routes.use(paymentMethod);
routes.use(order);
routes.use(company);
routes.use(contact);
routes.use(analytics);
routes.use(shippingNeighborhood);

export default routes;
