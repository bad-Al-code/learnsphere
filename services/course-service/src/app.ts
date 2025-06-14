import express, { json } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import logger from "./config/logger";
import { courseRouter, healthRouter } from "./routes";
import { currentUser } from "./middlewares/current-user";
import { errorHandler } from "./middlewares/error-handler";
import { moduleRouter } from "./routes/module";

const app = express();
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

app.use("/api/courses", healthRouter);
app.use("/api/courses", courseRouter);
app.use("/api/courses", moduleRouter);

app.use(errorHandler);

export { app };
