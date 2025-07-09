import { app } from "./app";
import { env } from "./config/env";
import logger from "./config/logger";
import { rabbitMQConnection } from "./events/connection";

const startApi = async (): Promise<void> => {
  try {
    await rabbitMQConnection.connect();

    app.listen(env.PORT, () => {
      logger.info(
        `Media service API listening on port ${env.PORT} in  ${env.NODE_ENV} mode`
      );
    });
  } catch (error) {
    logger.error(`Failed to start the media-service API`, { error });

    process.exit(1);
  }
};

startApi();
