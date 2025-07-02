import express, { json, Router } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import {
  courseRouter,
  healthRouter,
  lessonRouter,
  moduleRouter,
} from "./routes";
import { currentUser } from "./middlewares/current-user";
import { errorHandler } from "./middlewares/error-handler";
import { httpLogger } from "./middlewares/http-logger";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(helmet());
app.use(httpLogger);
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(currentUser);

app.use("/api/courses", healthRouter);
app.use("/api/courses", courseRouter);
app.use("/api/modules", moduleRouter);
app.use("/api/lessons", lessonRouter);

app.use(errorHandler);

export { app };
