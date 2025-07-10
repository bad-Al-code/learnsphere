import logger from './config/logger';
import { SqsWorker } from './workers/sqs-worker';

const startWorker = (): void => {
  try {
    logger.info(`Initializing SQS Worker...`);

    const worker = new SqsWorker();
    worker.start();
  } catch (error) {
    logger.error(`Failed to start the SQS Worker`, { error });
    process.exit(1);
  }
};

startWorker();
