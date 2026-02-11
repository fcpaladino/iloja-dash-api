import express, {Request, Response, NextFunction} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import AppError from "./errors/AppError";
import {asyncLocalStorage} from "./middleware/requestContext";
import path from "path";
import {logDevJson} from "./helpers/logDev";

const useragent = require('express-useragent');
const session = require('express-session');

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
const bodyParser = require('body-parser');

app.use(useragent.express());

app.use(session({
  secret: '5473ad70a366127adfcf56d678cae123',
  resave: false,
  saveUninitialized: true
}));


passport.use(
  new GoogleStrategy(
    {
      clientID: "1041228624875-b9hn0jh8pdjv82ssft18j35tipbd0ust.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:9292/google/auth/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      // Aqui você salva/busca o usuário no banco

      console.log('-------------- profile --------------');
      logDevJson(profile);
      logDevJson(accessToken);
      logDevJson(refreshToken);
      console.log('----------------------------');

      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(passport.initialize());
app.use(passport.session());

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/auth/redirect",
  passport.authenticate("google", { session: false }),
  (req, res) => {

    req.session.google = req.user;

    res.redirect("/google/perfil");
  }
);

app.get("/google/perfil", (req, res) => {
  if (!req.user) return res.redirect("/");
  res.json({
    user: req.user,
    google: req.session.google
  });
});

const corsOptions = {
  credentials: true,
  origin: '*'
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(bodyParser.json({ limit: '25mb' }));
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ limit: '25mb', extended: true, parameterLimit: 1000 }))

app.use("/midias", express.static(path.resolve(__dirname, "..", "midias")));

app.use(routes);

app.use((req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    res.set('X-Source', data?.items?.sourceDb || data?.sourceDb || "database");
    return originalJson(data);
  };
  next();
});

app.use((req, res, next) => {
  asyncLocalStorage.run({ req }, () => next());
});

app.use(async (err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err?.statusCode).json({ message: err?.message, errors: err?.errors });
  }
  return res.status(500).json({ error: "Internal server error" });
});

export default app;
