import "dotenv/config";

import { app } from "./app";
import logger from "./config/logger";
import { rabbitMQConnection } from "./events/connection";
import { redisConnection } from "./config/redis";
import { VideoProcessedListener } from "./events/listener";

const startServer = async () => {
  try {
    await rabbitMQConnection.connect();
    await redisConnection.connect();

    new VideoProcessedListener().listen();

    const PORT = process.env.PORT || 8001;

    app.listen(PORT, () => {
      logger.info(
        `Course service listening on port ${PORT} in ${process.env.NODE_ENV} mode`
      );
    });

    const shutdown = async () => {
      await rabbitMQConnection.close();
      await redisConnection.disconnect();
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    const err = error as Error;
    logger.error("Failed to start the server: %o", { errMessage: err.message });
    process.exit(1);
  }
};

startServer();
