import {
  DeleteMessageCommand,
  Message,
  ReceiveMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";

import { IProcessor } from "./processors/ip-processor";
import { AvatarProcessor } from "./processors/avatar-processor";
import { VideoProcessor } from "./processors/video-processor";
import logger from "../config/logger";
import { env } from "../config/env";
import { S3EventParser } from "./s3-event.parser";

const sqsClient = new SQSClient({ region: env.AWS_REGION! });

export class SqsWorker {
  private readonly queueUrl = env.AWS_SQS_QUEUE_URL!;
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

  private async delegateMessage(message: Message): Promise<void> {
    try {
      const { s3Info, metadata } = await S3EventParser.parse(message);

      const processor = this.processors.find((p) => p.canProcess(metadata));
      if (!processor) {
        throw new Error(
          `No processor found for message with metadata: ${JSON.stringify(
            metadata
          )}`
        );
      }

      await processor.process(message, s3Info, metadata);

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
