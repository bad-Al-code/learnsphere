import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
} from "@aws-sdk/client-sqs";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

import logger from "../config/logger";

const sqsClient = new SQSClient({ region: process.env.AWS_REGION! });
const s3Client = new S3Client({ region: process.env.AWS_REGION! });

export class SqsWorker {
  private readonly queueUrl = process.env.AWS_SQS_QUEUE_URL!;

  public start() {
    logger.info(`SQS Worker started. Polling queue: ${this.queueUrl}`);
    this.poll();
  }

  private async poll() {
    try {
      const receiveCommand = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20, // Use long polling
      });

      const { Messages } = await sqsClient.send(receiveCommand);

      if (Messages && Messages.length > 0) {
        logger.info(`${Messages.length} messages received from SQS.`);
        for (const message of Messages) {
          await this.processMessage(message);
        }
      }
    } catch (error) {
      const err = error as Error;
      logger.error(
        "Error polling SQS queue: %o",
        err.message,
        err.stack,
        err.name
      );
    } finally {
      setTimeout(() => this.poll(), 1000);
    }
  }

  private async processMessage(message: Message) {
    let s3Info: { bucket?: string; key?: string } = {};

    try {
      const body = JSON.parse(message.Body!);
      const s3Record = body.Records[0].s3;
      s3Info.bucket = s3Record.bucket.name;
      s3Info.key = decodeURIComponent(s3Record.object.key.replace(/\+/g, " "));

      logger.info("Processing S3 object", {
        s3Info,
      });

      const userId = s3Info.key.split("/")[2];
      if (!userId) throw new Error("Could not parse userId from S3 key");

      const getCommand = new GetObjectCommand({
        Bucket: s3Info.bucket,
        Key: s3Info.key,
      });
      const response = await s3Client.send(getCommand);
      const imageBuffer = Buffer.from(
        await response.Body!.transformToByteArray()
      );

      const processedImageBuffer = await sharp(imageBuffer)
        .resize(200, 200, { fit: "cover" })
        .jpeg({ quality: 90 })
        .toBuffer();

      const processedBucket = process.env.AWS_PROCESSED_MEDIA_BUCKET!;
      const processedKey = `avatars/${userId}.jpeg`; // Standardized filename

      const putCommand = new PutObjectCommand({
        Bucket: processedBucket,
        Key: processedKey,
        Body: processedImageBuffer,
        ContentType: "image/jpeg",
      });
      await s3Client.send(putCommand);

      const finalUrl = `https://${processedBucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${processedKey}`;
      logger.info(
        `Successfully processed and uploaded image. URL: ${finalUrl}`
      );

      // 5. TODO: Publish 'user.avatar.processed' event to RabbitMQ with { userId, finalUrl }

      const deleteCommand = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: message.ReceiptHandle!,
      });
      await sqsClient.send(deleteCommand);
    } catch (error) {
      const err = error as Error;
      logger.error("Error processing SQS message: %o", {
        bucket: s3Info.bucket,
        key: s3Info.key,
        errMessage: err.message,
        errName: err.name,
        errStack: err.stack,
      });
      // FIX: use a Dead-Letter Queue instead of just dropping it.
    }
  }
}
