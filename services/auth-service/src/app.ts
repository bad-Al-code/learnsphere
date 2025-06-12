import express, { json } from "express";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middlewares/error-handler";
import { authRouter, healthRouter } from "./routes";
import { httpLogger } from "./middlewares/http-logger";
import { currentUser } from "./middlewares/current-user";

const app = express();

app.use(json());
app.use(httpLogger);
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET));
app.use(currentUser);

app.use("/api/auth", healthRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

export { app };
