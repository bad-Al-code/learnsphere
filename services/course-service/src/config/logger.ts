import winston from "winston";

const { combine, timestamp, json, colorize, printf, splat } = winston.format;

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format:
    process.env.NODE_ENV === "development"
      ? combine(
          colorize(),
          timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          splat(),
          printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
        )
      : combine(timestamp(), json()),
  transports: [new winston.transports.Console()],
});

export default logger;
