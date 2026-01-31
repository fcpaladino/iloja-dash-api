import express from "express";
import Controller from "../controllers/Admin/RoleController";
import isAuth from "../middleware/isAuth";

const route = express.Router();

route.get("/admin/role", isAuth, Controller.index);
route.get("/admin/role/list", isAuth, Controller.list);
route.get("/admin/role/:id", isAuth, Controller.show);
route.post("/admin/role", isAuth, Controller.store);
route.put("/admin/role/:id", isAuth, Controller.update);
route.delete("/admin/role/:ids", isAuth, Controller.destroy);

route.get("/admin/permissions", isAuth, Controller.getPermissions);

export default route;
