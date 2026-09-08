import express from "express";
import Login from "../controllers/Auth/LoginController";
import PasswordSend from "../controllers/Auth/PasswordSendController";
import PasswordReset from "../controllers/Auth/PasswordResetController";
import TwoFa from "../controllers/Auth/TwoFaController";
import isAuth from "../middleware/isAuth";
import CustomerAuth from "../controllers/Auth/CustomerAuthController";

const route = express.Router();

route.post("/auth/login", Login.store);
route.post("/auth/whatsapp/request", CustomerAuth.requestCode);
route.post("/auth/whatsapp/verify", CustomerAuth.verifyCode);
route.put("/auth/whatsapp/profile", isAuth, CustomerAuth.updateProfile);
route.post("/auth/whatsapp/change-request", isAuth, CustomerAuth.requestPhoneChange);
route.post("/auth/whatsapp/change-verify", isAuth, CustomerAuth.confirmPhoneChange);

route.post("/auth/refresh-token", Login.refresh);

route.get("/auth/2fa/generate", isAuth, TwoFa.generate);
route.post("/auth/2fa/validate", isAuth, TwoFa.validate);
route.delete("/auth/2fa/remove", isAuth, TwoFa.remove);

// @todo fazer
route.post("/auth/password-send", PasswordSend.store);

// @todo fazer
route.post("/auth/password-reset", PasswordReset.store);

route.delete("/auth/logout", Login.logout);

export default route;
