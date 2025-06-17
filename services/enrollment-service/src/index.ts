import "dotenv/config";

import { app } from "./app";
import logger from "./config/logger";
import { rabbitMQConnection } from "./events/connection";

const startServer = async () => {
  try {
    await rabbitMQConnection.connect();

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      logger.info(
        `Enrollment service listening on port ${PORT} in ${process.env.NODE_ENV} mode`
      );
    });

    const shutdown = async () => {
      await rabbitMQConnection.close();
      process.exit(0);
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    logger.error("Failed to start the server", { error });
    process.exit(1);
  }
};

startServer();
