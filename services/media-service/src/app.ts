import express, { json } from "express";
import { healthRouter } from "./routes";
import logger from "./config/logger";

const app = express();
app.use(json());

app.use((req, res, next) => {
  res.on("finish", () => {
    logger.info(
      `HTTP Request: ${req.method} ${req.originalUrl} - Status ${res.statusCode}`
    );
  });
  next();
});

app.use("/api/media", healthRouter);

export { app };
