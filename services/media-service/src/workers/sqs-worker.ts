import {
  DeleteMessageCommand,
  Message,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs';

import logger from '../config/logger';
import { env } from '../config/env';
import { S3EventParser } from './s3-event-parser';
import { ProcessorFactory } from './processor.factory';

const sqsClient = new SQSClient({ region: env.AWS_REGION });

export class SqsWorker {
  private readonly queueUrl = env.AWS_SQS_QUEUE_URL;
  private readonly processorFactory: ProcessorFactory;

  constructor(processorFactory: ProcessorFactory) {
    this.processorFactory = processorFactory;
    logger.info(`Worker initialized with a processor factory`);
  }

  public start(): void {
    logger.info(`SQS Worker started. Polling queue: ${this.queueUrl}`);
    this.poll();
  }

  private async poll(): Promise<void> {
    try {
      const receiveCommand = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
      });

      const { Messages } = await sqsClient.send(receiveCommand);

      if (Messages && Messages.length > 0) {
        logger.info(`${Messages.length} message(s) received from SQS.`);
        const processingPromises = Messages.map((message) =>
          this.handleMessage(message)
        );
        await Promise.all(processingPromises);
      }
    } catch (error) {
      logger.error('Error polling SQS queue:', { error });
    } finally {
      setTimeout(() => this.poll(), 1000);
    }
  }

  private async handleMessage(message: Message): Promise<void> {
    const parsedMessage = await S3EventParser.parse(message);

    if (!parsedMessage) {
      logger.warn('Could not parse SQS message. Deleting from queue.', {
        messageId: message.MessageId,
      });
      await this.deleteMessage(message.ReceiptHandle!);
      return;
    }

    const { s3Info, metadata } = parsedMessage;
    const processor = this.processorFactory.getProcessor(metadata);

    if (!processor) {
      await this.deleteMessage(message.ReceiptHandle!);

      return;
    }

    try {
      logger.info(`Delegating message to ${processor.constructor.name}.`, {
        key: s3Info.key,
      });
      await processor.process(s3Info, metadata);

      await this.deleteMessage(message.ReceiptHandle!);
      logger.info(`Successfully processed and deleted message.`, {
        key: s3Info.key,
      });
    } catch (error) {
      logger.error(
        `Processor failed for message. It will be returned to the queue.`,
        {
          processor: processor.constructor.name,
          key: s3Info.key,
          error: error instanceof Error ? error.message : String(error),
        }
      );
    }
  }

  private async deleteMessage(receiptHandle: string): Promise<void> {
    const deleteCommand = new DeleteMessageCommand({
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    });
    await sqsClient.send(deleteCommand);
  }
}
