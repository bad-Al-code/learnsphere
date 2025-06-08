import winston from "winston";

const { combine, colorize, timestamp, printf, json } = winston.format;

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  format:
    process.env.NODE_ENV === "development"
      ? combine(
          colorize(),
          timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
        )
      : combine(timestamp(), json()),
  transports: [new winston.transports.Console()],
});

export default logger;
