import express, { json, Router } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import logger from "./config/logger";
import {
  courseRouter,
  healthRouter,
  lessonRouter,
  moduleRouter,
} from "./routes";
import { currentUser } from "./middlewares/current-user";
import { errorHandler } from "./middlewares/error-handler";
import { internalRouter } from "./routes/internal";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));

app.use((req, res, next) => {
  res.on("finish", () => {
    logger.info(
      `HTTP Request: ${req.method} ${req.originalUrl} - Status ${res.statusCode}`
    );
  });
  next();
});

app.use("/api/courses", internalRouter);

const userApiRouter = Router();
userApiRouter.use(currentUser);

userApiRouter.use("/courses", courseRouter);
userApiRouter.use("/modules", moduleRouter);
userApiRouter.use("/lessons", lessonRouter);
app.use("/api", userApiRouter);

app.use("/api/courses", healthRouter);

app.use(errorHandler);

export { app };
