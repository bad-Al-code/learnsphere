import express, { json } from "express";
import { errorHandler } from "./middlewares/error-handler";
import { authRouter, healthRouter } from "./routes";
import { httpLogger } from "./middlewares/http-logger";

const app = express();

app.use(json());
app.use(httpLogger);

app.use("/api/auth", healthRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

export { app };
