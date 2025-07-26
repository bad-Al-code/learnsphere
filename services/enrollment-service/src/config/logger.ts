import winston from 'winston';

const { combine, colorize, timestamp, splat, errors, printf, json } =
  winston.format;

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  format:
    process.env.NODE_ENV === 'development'
      ? combine(
          colorize(),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          splat(),
          errors({ stack: true }),
          printf(
            (info) =>
              `${info.timestamp} ${info.level}: ${info.message} ${
                info.stack ? `\n${info.stack}` : ''
              }`
          )
        )
      : combine(timestamp(), splat(), errors({ stack: true }), json()),
  transports: [new winston.transports.Console()],
});

export default logger;
