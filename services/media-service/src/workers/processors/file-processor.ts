import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { s3, S3ClientService } from '../../clients/s3.client';
import { env } from '../../config/env';
import logger from '../../config/logger';
import { MediaRepository } from '../../db/media.repository';
import {
  ChatMediaProcessedPublisher,
  CourseResourceFailurePublisher,
  CourseResourceProcessedPublisher,
} from '../../events/publisher';
import { IProcessor, S3EventInfo } from '../../types';

export class FileProcessor implements IProcessor {
  private readonly successPublisher: CourseResourceProcessedPublisher;
  private readonly failurePublisher: CourseResourceFailurePublisher;
  private readonly chatSuccessPublisher: ChatMediaProcessedPublisher;

  constructor() {
    this.successPublisher = new CourseResourceProcessedPublisher();
    this.failurePublisher = new CourseResourceFailurePublisher();
    this.chatSuccessPublisher = new ChatMediaProcessedPublisher();
  }

  public canProcess(metadata: Record<string, string | undefined>): boolean {
    return (
      metadata.uploadType === 'course_resource' ||
      metadata.uploadType === 'chat_attachment'
    );
  }

  public async process(
    s3Info: S3EventInfo,
    metadata: Record<string, string | undefined>
  ): Promise<void> {
    const { uploadType, courseId, conversationId, senderId } = metadata;

    if (uploadType === 'chat_attachment') {
      if (!conversationId || !senderId) {
        throw new Error(
          'FileProcessor called with chat_attachment but missing conversationId or senderId'
        );
      }

      logger.info(
        `Processing chat attachment for conversation: ${conversationId}, sender: ${senderId}`
      );

      try {
        const { finalUrl, contentLength, contentType, fileName } =
          await this._processFile(s3Info, `chat/${conversationId}`);

        await this.chatSuccessPublisher.publish({
          conversationId,
          senderId,
          fileUrl: finalUrl,
          fileName,
          fileSize: contentLength,
          fileType: contentType,
        });

        logger.info(`Chat attachment processed successfully: ${finalUrl}`);
      } catch (error) {
        logger.error(
          `Failed to process chat attachment for conversation ${conversationId}:`,
          error
        );
        throw error;
      }
    } else if (uploadType === 'course_resource') {
      if (!courseId)
        throw new Error(`FileProcessor called without a courseId.`);

      logger.info(`Processing resource for course: ${courseId}`);

      try {
        await MediaRepository.updateByS3Key(s3Info.key, {
          status: 'processing',
        });

        const { finalUrl, contentLength, contentType, fileName } =
          await this._processFile(s3Info, `resources/${courseId}`);

        await MediaRepository.updateByS3Key(s3Info.key, {
          status: 'completed',
          processedUrls: { final: finalUrl },
        });

        await this.successPublisher.publish({
          courseId,
          fileUrl: finalUrl,
          fileName,
          fileSize: contentLength,
          fileType: contentType,
        });

        logger.info(`Course resource processed successfully: ${finalUrl}`);
      } catch (error) {
        await MediaRepository.updateByS3Key(s3Info.key, {
          status: 'failed',
          errorMessage: (error as Error).message,
        });

        const err = error as Error;

        await this.failurePublisher.publish({
          courseId,
          reason: err.message || 'An unknown processing error occurred.',
        });

        throw error;
      }
    } else {
      throw new Error(
        `Unsupported upload type in FileProcessor: ${uploadType}`
      );
    }
  }

  /**
   * Shared logic for downloading, reading metadata, uploading,
   * and returning final file info.
   */
  private async _processFile(
    s3Info: S3EventInfo,
    prefix: string
  ): Promise<{
    finalUrl: string;
    contentLength: number;
    contentType: string;
    fileName: string;
  }> {
    const processedBucket = env.AWS_PROCESSED_MEDIA_BUCKET;
    const region = env.AWS_REGION;

    const fileBuffer = await S3ClientService.downloadFileAsBuffer(
      s3Info.bucket,
      s3Info.key
    );

    const fileName = s3Info.key.split('/').pop()!;
    const processedKey = `${prefix}/${fileName}`;

    const s3ObjectMetadata = await s3.send(
      new HeadObjectCommand({ Bucket: s3Info.bucket, Key: s3Info.key })
    );

    const contentType =
      s3ObjectMetadata.ContentType || 'application/octet-stream';
    const contentLength = s3ObjectMetadata.ContentLength || 0;

    await S3ClientService.uploadBuffer(
      processedBucket,
      processedKey,
      fileBuffer,
      contentType,
      'public-read'
    );

    const finalUrl = `https://${processedBucket}.s3.${region}.amazonaws.com/${processedKey}`;

    return { finalUrl, contentLength, contentType, fileName };
  }
}
