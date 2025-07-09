import logger from "./config/logger";
import { rabbitMQConnection } from "./events/connection";
import { SqsWorker } from "./workers/sqs-worker";

const startWorker = async (): Promise<void> => {
  try {
    await rabbitMQConnection.connect();

    logger.info(`Starting SQS worker process...`);

    const worker = new SqsWorker();
    worker.start();
  } catch (error) {
    logger.error("Failed to start the media-service worker", { error });

    process.exit(1);
  }
};

startWorker();
