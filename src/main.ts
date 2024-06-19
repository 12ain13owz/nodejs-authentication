require("dotenv").config();

import express from "express";
import config from "config";
import morgan from "morgan";
import dbConnect from "./utils/db-connect";
import log from "./utils/logger";
import router from "./routes";
import deserializeUser from "./middleware/deserializeUser";

const app = express();
const port = config.get<number>("port");

app.use(morgan("dev"));
app.use(express.json());
app.use(deserializeUser);
app.use(router);

app.listen(port, () => {
  log.info(`App Stated at http://localhpst:${port}`);
  dbConnect();
});
