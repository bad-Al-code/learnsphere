import sharp from 'sharp';

import { S3ClientService } from '../../clients/s3.client';
import { env } from '../../config/env';
import logger from '../../config/logger';
import { MediaRepository } from '../../db/media.repository';
import { CourseThumbnailProcessedPublisher } from '../../events/publisher';
import { IProcessor, S3EventInfo } from '../../types';

const THUMBNAIL_WIDTH = 1280;
const THUMBNAIL_HEIGHT = 720;

export class ThumbnailProcessor implements IProcessor {
  private readonly successPublisher: CourseThumbnailProcessedPublisher;

  constructor() {
    this.successPublisher = new CourseThumbnailProcessedPublisher();
  }

  /**
   * Determines if this processor can handle a task based on metadata.
   * @param metadata - The metadata tags from the S3 object.
   * @returns True if the uploadType is 'course_thumbnail'.
   */
  public canProcess(metadata: Record<string, string | undefined>): boolean {
    return metadata.uploadType === 'course_thumbnail';
  }

  public async process(
    s3Info: S3EventInfo,
    metadata: Record<string, string | undefined>
  ): Promise<void> {
    const courseId = metadata.courseId;
    if (!courseId) {
      throw new Error(
        `ThumbnailProcessor called without a courseId in metadata.`
      );
    }

    logger.info(`Processing thumbnail for course: ${courseId}`);

    const processedBucket = env.AWS_PROCESSED_MEDIA_BUCKET;
    const region = env.AWS_REGION;

    try {
      await MediaRepository.updateByS3Key(s3Info.key, { status: 'processing' });

      const imageBuffer = await S3ClientService.downloadFileAsBuffer(
        s3Info.bucket,
        s3Info.key
      );

      const finalBuffer = await sharp(imageBuffer)
        .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, { fit: 'cover' })
        .jpeg({ quality: 90 })
        .toBuffer();

      const processedKey = `thumbnails/${courseId}/thumbnail.jpeg`;

      await S3ClientService.uploadBuffer(
        processedBucket,
        processedKey,
        finalBuffer,
        'image/jpeg'
      );

      const finalUrl = `https://${processedBucket}.s3.${region}.amazonaws.com/${processedKey}`;

      await MediaRepository.updateByS3Key(s3Info.key, {
        status: 'completed',
        processedUrls: { final: finalUrl },
      });

      await this.successPublisher.publish({ courseId, imageUrl: finalUrl });
    } catch (error) {
      const errorMessage = (error as Error).message;

      await MediaRepository.updateByS3Key(s3Info.key, {
        status: 'failed',
        errorMessage,
      });

      throw error;
    }
  }
}
