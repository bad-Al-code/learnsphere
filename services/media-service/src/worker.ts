import logger from './config/logger';
import { AvatarProcessor } from './workers/processors/avatar-processor';
import { VideoProcessor } from './workers/processors/video-processor';
import { SqsWorker } from './workers/sqs-worker';

const startWorker = (): void => {
  try {
    logger.info(`Initializing SQS Worker and its dependencies...`);

    const processors = [new AvatarProcessor(), new VideoProcessor()];

    const worker = new SqsWorker(processors);
    worker.start();
  } catch (error) {
    logger.error(`Failed to start the SQS Worker`, { error });
    process.exit(1);
  }
};

startWorker();
