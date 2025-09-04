import logger from './config/logger';
import { ReportGenerationListener } from './events/listener';
import { ProcessorFactory } from './workers/processor.factory';
import { AvatarProcessor } from './workers/processors/avatar-processor';
import { FileProcessor } from './workers/processors/file-processor';
import { ReportProcessor } from './workers/processors/report-processor';
import { ThumbnailProcessor } from './workers/processors/thumbnail-processor';
import { VideoProcessor } from './workers/processors/video-processor';
import { SqsWorker } from './workers/sqs-worker';

const startWorker = (): void => {
  try {
    logger.info(`Initializing SQS Worker and its dependencies...`);

    const processors = [
      new AvatarProcessor(),
      new VideoProcessor(),
      new ThumbnailProcessor(),
      new FileProcessor(),
    ];

    const processorFactory = new ProcessorFactory(processors);
    const worker = new SqsWorker(processorFactory);

    worker.start();

    const reportProcessor = new ReportProcessor();
    const reportListener = new ReportGenerationListener(reportProcessor);

    reportListener.listen();

    logger.info('All workers started successfully.');
  } catch (error) {
    logger.error(`Failed to start the SQS Worker`, { error });
    process.exit(1);
  }
};

startWorker();
