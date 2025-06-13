import "dotenv/config";

import logger from "./config/logger";
import { rabbitMQConnection } from "./events/connection";
import {
  UserPasswordResetRequiredListener,
  UserVerificationRequiredListener,
} from "./events/listener";

const start = async () => {
  try {
    await rabbitMQConnection.connect();

    new UserVerificationRequiredListener().listen();
    new UserPasswordResetRequiredListener().listen();

    logger.info(`Notification service is ready`);
  } catch (error) {
    const err = error as Error;
    logger.error("Failed to start notification service: %o", {
      errMessage: err.message,
      errStack: err.stack,
      errName: err.name,
    });
    process.exit(1);
  }

  const shutdown = async () => {
    await rabbitMQConnection.close();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

start();
