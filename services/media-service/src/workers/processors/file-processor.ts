import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { s3, S3ClientService } from '../../clients/s3.client';
import { env } from '../../config/env';
import logger from '../../config/logger';
import { MediaRepository } from '../../db/media.repository';
import {
  CourseResourceFailurePublisher,
  CourseResourceProcessedPublisher,
} from '../../events/publisher';
import { IProcessor, S3EventInfo } from '../../types';

export class FileProcessor implements IProcessor {
  private readonly successPublisher: CourseResourceProcessedPublisher;
  private readonly failurePublisher: CourseResourceFailurePublisher;

  constructor() {
    this.successPublisher = new CourseResourceProcessedPublisher();
    this.failurePublisher = new CourseResourceFailurePublisher();
  }

  public canProcess(metadata: Record<string, string | undefined>): boolean {
    return metadata.uploadType === 'course_resource';
  }

  public async process(
    s3Info: S3EventInfo,
    metadata: Record<string, string | undefined>
  ): Promise<void> {
    const courseId = metadata.courseId;
    if (!courseId) throw new Error(`FileProcessor called without a courseId.`);

    logger.info(`Processing resource for course: ${courseId}`);
    const processedBucket = env.AWS_PROCESSED_MEDIA_BUCKET;
    const region = env.AWS_REGION;

    try {
      await MediaRepository.updateByS3Key(s3Info.key, { status: 'processing' });

      const fileBuffer = await S3ClientService.downloadFileAsBuffer(
        s3Info.bucket,
        s3Info.key
      );

      const processedKey = `resources/${courseId}/${s3Info.key.split('/').pop()}`;

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

      await MediaRepository.updateByS3Key(s3Info.key, {
        status: 'completed',
        processedUrls: { final: finalUrl },
      });

      await this.successPublisher.publish({
        courseId,
        fileUrl: finalUrl,
        fileName: s3Info.key.split('/').pop()!,
        fileSize: contentLength,
        fileType: contentType,
      });
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
  }
}
