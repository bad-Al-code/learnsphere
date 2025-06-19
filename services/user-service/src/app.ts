import express, { json } from "express";
import cookieParser from "cookie-parser";

import logger from "./config/logger";
import { healthRouter, profileRouter } from "./routes";
import { currentUser } from "./middlewares/current-user";
import { errorHandler } from "./middlewares/error-handler";
import helmet from "helmet";

const app = express();

// app.set("trust proxy", true);
app.use(json());
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(currentUser);

app.use((req, res, next) => {
  res.on("finish", () => {
    logger.info(
      `HTTP Request: ${req.method} ${req.originalUrl} - Status ${res.statusCode}`
    );
  });
  next();
});

app.use("/api/users", healthRouter);
app.use("/api/users", profileRouter);

app.use(errorHandler);

export { app };
