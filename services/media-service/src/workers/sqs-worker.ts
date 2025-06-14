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
import {
  UserAvatarFailedPublisher,
  UserAvatarProcessedPublisher,
} from "../events/publisher";
import path from "node:path";

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
        WaitTimeSeconds: 20, // long polling
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
    let userId: string | undefined;

    try {
      const body = JSON.parse(message.Body!);
      const s3Record = body.Records[0].s3;
      s3Info.bucket = s3Record.bucket.name;
      s3Info.key = decodeURIComponent(s3Record.object.key.replace(/\+/g, " "));

      logger.info("Processing S3 object", {
        s3Info,
      });

      userId = s3Info.key.split("/")[2];
      if (!userId) throw new Error("Could not parse userId from S3 key");

      const getCommand = new GetObjectCommand({
        Bucket: s3Info.bucket,
        Key: s3Info.key,
      });
      const response = await s3Client.send(getCommand);
      const imageBuffer = Buffer.from(
        await response.Body!.transformToByteArray()
      );

      const fileExtension = path.extname(s3Info.key).toLowerCase();
      let processedBuffer: Buffer;
      let contentType: string;
      const newExention = ".jpeg";

      const sharpInstance = sharp(imageBuffer);

      switch (fileExtension) {
        case ".jpg":
        case ".jpeg":
          processedBuffer = await sharpInstance
            .jpeg({ quality: 90 })
            .toBuffer();
          contentType = "image/jpeg";
          break;
        case ".png":
          processedBuffer = await sharpInstance
            .jpeg({ quality: 90 })
            .toBuffer();
          contentType = "image/jpeg";
          break;
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`);
      }

      const sizes = { small: 50, medium: 200, large: 800 };
      const processedBucket = process.env.AWS_PROCESSED_MEDIA_BUCKET!;
      const processedUrls: { [key: string]: string } = {};

      const uploadPromises = Object.entries(sizes).map(
        async ([sizeName, size]) => {
          const finalBuffer = await sharp(imageBuffer)
            .resize(size, size, { fit: "cover" })
            .jpeg({ quality: 90 })
            .toBuffer();

          const processedKey = `avatars/${userId}-${sizeName}${newExention}`;

          const putCommand = new PutObjectCommand({
            Bucket: processedBucket,
            Key: processedKey,
            Body: finalBuffer,
            ContentType: contentType,
          });

          await s3Client.send(putCommand);

          const finalUrl = `https://${processedBucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${processedKey}`;

          processedUrls[sizeName] = finalUrl;

          logger.info(
            `Successfully processed and uploaded '${sizeName}' avatar for user ${userId}`
          );
        }
      );

      await Promise.all(uploadPromises);

      logger.info(
        `All avatar sizes successfully processed for user ${userId}`,
        { urls: processedUrls }
      );

      const publisher = new UserAvatarProcessedPublisher();
      await publisher.publish({ userId: userId, avatarUrls: processedUrls });

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

      if (userId) {
        try {
          const failurePublisher = new UserAvatarFailedPublisher();
          await failurePublisher.publish({
            userId,
            reason: err.message || "An unknown processing error occurred.",
          });

          logger.info(`Publisher user.avatar.failed event for user: ${userId}`);
        } catch (publishError) {
          logger.error(
            "CRITICAL: Failed to publish the failure event to RabbitMQ",
            { publishError }
          );
        }
      }
    }
  }
}
