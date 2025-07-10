import {
  DeleteMessageCommand,
  Message,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';

import { IProcessor } from './processors/ip-processor';
import { AvatarProcessor } from './processors/avatar-processor';
import { VideoProcessor } from './processors/video-processor';
import logger from '../config/logger';
import { S3ClientService } from '../clients/s3.client';

const sqsClient = new SQSClient({ region: process.env.AWS_REGION! });

export class SqsWorker {
  private readonly queueUrl = process.env.AWS_SQS_QUEUE_URL!;
  private readonly processors: IProcessor[];

  constructor() {
    this.processors = [new AvatarProcessor(), new VideoProcessor()];
    logger.info(
      `Worker initialized with ${this.processors.length} processors.`
    );
  }

  public start() {
    logger.info(`SQS Worker started. Polling queue: ${this.queueUrl}`);
    this.poll();
  }

  private async poll() {
    try {
      const receiveCommand = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
      });

      const { Messages } = await sqsClient.send(receiveCommand);

      if (Messages && Messages.length > 0) {
        logger.info(`${Messages.length} message received from SQS.`);

        await Promise.all(
          Messages.map((message) => this.delegateMessage(message))
        );
      }
    } catch (error) {
      logger.error(`Error polling SQS queue: `, {
        error: (error as Error).message,
      });
    } finally {
      setTimeout(() => this.poll(), 1000);
    }
  }

  private async delegateMessage(message: Message) {
    try {
      const body = JSON.parse(message.Body!);
      const s3Record = body.Records[0].s3;
      const s3Info = {
        bucket: s3Record.bucket.name,
        key: decodeURIComponent(s3Record.object.key.replace(/\+/g, ' ')),
      };

      const metadata = await S3ClientService.getObjectTags(
        s3Info.bucket,
        s3Info.key
      );

      const processor = this.processors.find((p) => p.canProcess(metadata));
      if (processor) {
        await processor.process(message, s3Info, metadata);
      } else {
        throw new Error(
          `No processor found for message with metadata: ${JSON.stringify(
            metadata
          )}`
        );
      }

      const deleteCommand = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: message.ReceiptHandle!,
      });
      await sqsClient.send(deleteCommand);
    } catch (error) {
      logger.error(
        `Failed to process message. It will ne returned to the queue or send to D.Q.`,
        {
          messageId: message.MessageId,
          error: (error as Error).message,
        }
      );
    }
  }
}
