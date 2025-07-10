import { IProcessor, S3EventInfo } from './ip-processor';
import logger from '../../config/logger';
import {
  UserAvatarFailedPublisher,
  UserAvatarProcessedPublisher,
} from '../../events/publisher';
import { S3ClientService } from '../../clients/s3.client';
import { ImageClient } from '../../clients/image.client';
import { MediaRepository } from '../../db/media.repository';

export class AvatarProcessor implements IProcessor {
  private readonly successPublisher: UserAvatarProcessedPublisher;
  private readonly failurePublisher: UserAvatarFailedPublisher;

  constructor() {
    this.successPublisher = new UserAvatarProcessedPublisher();
    this.failurePublisher = new UserAvatarFailedPublisher();
  }

  /**
   * Determines if this processor can handle a task based on metadata.
   * @param metadata - The metadata tags from the S3 object.
   * @returns True if the uploadType is 'avatar'.
   */
  public canProcess(metadata: Record<string, string | undefined>): boolean {
    return metadata.uploadType === 'avatar';
  }

  /**
   * Orchestrates the avatar processing workflow.
   * @param s3Info - Information about the uploaded S3 object.
   * @param metadata - The metadata tags associated with the object.
   */
  public async process(
    s3Info: S3EventInfo,
    metadata: Record<string, string | undefined>
  ): Promise<void> {
    const userId = metadata.userId;
    if (!userId) {
      throw new Error(`AvatarProcessor called without a userId in metadata.`);
    }

    logger.info(`Processing avatar for user: ${userId}`);

    try {
      await MediaRepository.updateByS3Key(s3Info.key, { status: 'processing' });

      const imageBuffer = await S3ClientService.downloadFileAsBuffer(
        s3Info.bucket,
        s3Info.key
      );

      const avatarUrls = await ImageClient.processAndUploadAvatar(
        imageBuffer,
        userId
      );

      await MediaRepository.updateByS3Key(s3Info.key, {
        status: 'completed',
        processedUrls: avatarUrls,
      });

      await this.successPublisher.publish({ userId, avatarUrls });
    } catch (error) {
      await MediaRepository.updateByS3Key(s3Info.key, {
        status: 'failed',
        errorMessage: (error as Error).message,
      });

      const err = error as Error;

      await this.failurePublisher.publish({
        userId,
        reason: err.message || 'An unknown processing error occurred.',
      });

      throw error;
    }
  }
}
