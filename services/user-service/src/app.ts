import express, { json } from "express";
import logger from "./config/logger";
import { healthRouter } from "./config/routes";

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

app.use("/api/users", healthRouter);

export { app };
