import express from "express";
import multer from "multer";
import Controller from "../controllers/Admin/UserController";
import isAuth from "../middleware/isAuth";

import uploadConfig from "../config/upload";
const upload = multer(uploadConfig);

const route = express.Router();

route.get("/admin/user", isAuth, Controller.index);
route.get("/admin/user/:id", isAuth, Controller.show);
route.post("/admin/user", isAuth, Controller.store);
route.put("/admin/user/:id", isAuth, Controller.update);
route.put("/admin/user/change-password/:id", isAuth, Controller.changePassword);
route.delete("/admin/user/:ids", isAuth, Controller.destroy);

route.post("/admin/user/password-reset", isAuth, Controller.email);

route.post(
  "/admin/user/profilePicUrl/:userId",
  isAuth,
  upload.single("file"),
  Controller.uploadProfilePicUrl
);

route.delete("/admin/user/profilePicUrl/:userId", isAuth, Controller.destroyProfilePicUrl);

export default route;
