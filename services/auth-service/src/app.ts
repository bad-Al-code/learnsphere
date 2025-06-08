import express, { json } from "express";
import { errorHandler } from "./middlewares/error-handler";
import { authRouter, healthRouter } from "./routes";

const app = express();

app.use(json());
app.use("/api/auth", healthRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

export { app };
