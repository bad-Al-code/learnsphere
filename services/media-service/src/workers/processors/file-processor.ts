// import { mkdirSync, writeFileSync } from 'fs';
// import { dirname, join } from 'path';
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { s3, S3ClientService } from '../../clients/s3.client';
import { env } from '../../config/env';
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

    try {
      await MediaRepository.updateByS3Key(s3Info.key, { status: 'processing' });

      let prefix: string;
      if (uploadType === 'course_resource' && courseId) {
        prefix = `resources/${courseId}`;
      } else if (uploadType === 'chat_attachment' && conversationId) {
        prefix = `chat/${conversationId}`;
      } else {
        throw new Error(
          `Invalid metadata for FileProcessor: ${JSON.stringify(metadata)}`
        );
      }

      const { finalUrl, contentLength, contentType, fileName } =
        await this._processFile(s3Info, prefix);

      await MediaRepository.updateByS3Key(s3Info.key, {
        status: 'completed',
        processedUrls: { final: finalUrl },
      });

      if (uploadType === 'chat_attachment') {
        await this.chatSuccessPublisher.publish({
          conversationId: conversationId!,
          senderId: senderId!,
          fileUrl: finalUrl,
          fileName,
          fileSize: contentLength,
          fileType: contentType,
        });
      } else {
        await this.successPublisher.publish({
          courseId: courseId!,
          fileUrl: finalUrl,
          fileName,
          fileSize: contentLength,
          fileType: contentType,
        });
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      await MediaRepository.updateByS3Key(s3Info.key, {
        status: 'failed',
        errorMessage,
      });

      if (uploadType === 'course_resource' && courseId) {
        await this.failurePublisher.publish({ courseId, reason: errorMessage });
      }

      throw error;
    }
  }

  /**
   * Shared logic for file handling
   * In dev: saves file locally under ./processed/
   * In prod (AWS): uncomment S3 logic
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
    // --- DEV LOCAL ONLY ---
    // const fileName = s3Info.key.split('/').pop()!;
    // const processedPath = join(process.cwd(), 'processed', prefix, fileName);

    // mkdirSync(dirname(processedPath), { recursive: true });

    // // Fake file buffer and metadata (in real AWS we’d fetch from S3)
    // const fileBuffer = Buffer.from(`Dummy content for ${fileName}`);
    // const contentType = 'application/octet-stream';
    // const contentLength = fileBuffer.length;

    // writeFileSync(processedPath, fileBuffer);

    // const finalUrl = `file://${processedPath}`;
    // logger.info(`Saved locally: ${finalUrl}`);

    // return { finalUrl, contentLength, contentType, fileName };

    // --- AWS ONLY ---

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
