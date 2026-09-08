import express from "express";
import Controller from "../controllers/FeedController";

const route = express.Router();
route.get("/feed/meta/products/:companyKey.csv", Controller.csv);
route.get("/feed/meta/products.csv", Controller.csv);

export default route;
