import express, {Request, Response, NextFunction} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import AppError from "./errors/AppError";
import {asyncLocalStorage} from "./middleware/requestContext";
import path from "path";

const useragent = require('express-useragent');
const session = require('express-session');

const app = express();
const bodyParser = require('body-parser');

app.use(useragent.express());

app.use(session({
  secret: '5473ad70a366127adfcf56d678cae123',
  resave: false,
  saveUninitialized: true
}));

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
