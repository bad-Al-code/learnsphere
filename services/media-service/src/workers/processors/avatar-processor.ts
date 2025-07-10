import { IProcessor, S3EventInfo } from './ip-processor';
import logger from '../../config/logger';
import {
  UserAvatarFailedPublisher,
  UserAvatarProcessedPublisher,
} from '../../events/publisher';
import { S3ClientService } from '../../clients/s3.client';
import { ImageClient } from '../../clients/image.client';

export class AvatarProcessor implements IProcessor {
  private readonly successPublisher: UserAvatarProcessedPublisher;
  private readonly failurePublisher: UserAvatarFailedPublisher;

  constructor() {
    this.successPublisher = new UserAvatarProcessedPublisher();
    this.failurePublisher = new UserAvatarFailedPublisher();
  }

  /**
   *
   * @param metadata
   * @returns
   */
  public canProcess(metadata: Record<string, string | undefined>): boolean {
    return metadata.uploadType === 'avatar';
  }

  /**
   *
   * @param s3Info
   * @param metadata
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
      const imageBuffer = await S3ClientService.downloadFileAsBuffer(
        s3Info.bucket,
        s3Info.key
      );

      const avatarUrls = await ImageClient.processAndUploadAvatar(
        imageBuffer,
        userId
      );

      await this.successPublisher.publish({ userId, avatarUrls });
    } catch (error) {
      const err = error as Error;
      logger.error('Error processing avatar', { userId, error: err.message });

      await this.failurePublisher.publish({
        userId,
        reason: err.message || 'An unknown processing error occurred.',
      });

      throw error;
    }
  }
}
