import "dotenv/config";
import { app } from "./app";
import logger from "./config/logger";
import { SqsWorker } from "./workers/sqs-worker";
import { rabbitMQConnection } from "./events/connection";

const start = async () => {
  try {
    await rabbitMQConnection.connect();

    const PORT = process.env.PORT || 8002;
    app.listen(PORT, () => {
      logger.info(`Media service API listening on port ${PORT}`);
    });

    const worker = new SqsWorker();
    worker.start();
  } catch (error) {
    logger.error("Failed to start the media-service", { error });
    process.exit(1);
  }
};

start();
