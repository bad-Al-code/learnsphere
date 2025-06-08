import express, { json } from "express";
import { healthRouter } from "./routes/health";
import { errorHandler } from "./middlewares/error-handler";

const app = express();

app.use(json());
app.use("/api/auth", healthRouter);

app.use(errorHandler);

export { app };
