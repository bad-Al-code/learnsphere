import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { IProcessor, S3EventInfo } from './ip-processor';
import logger from '../../config/logger';
import sharp from 'sharp';
import {
  UserAvatarFailedPublisher,
  UserAvatarProcessedPublisher,
} from '../../events/publisher';
import { env } from '../../config/env';

const s3Client = new S3Client({ region: env.AWS_REGION });

export class AvatarProcessor implements IProcessor {
  public canProcess(metadata: Record<string, string | undefined>): boolean {
    return metadata.uploadType === 'avatar';
  }

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
      const getCommand = new GetObjectCommand({
        Bucket: s3Info.bucket,
        Key: s3Info.key,
      });
      const response = await s3Client.send(getCommand);

      const imageBuffer = Buffer.from(
        await response.Body!.transformToByteArray()
      );
      const processedImageBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 90 })
        .toBuffer();
      const sizes = { small: 50, medium: 200, large: 800 };

      const processedBucket = env.AWS_PROCESSED_MEDIA_BUCKET;
      const processedUrls: { [key: string]: string } = {};

      const uploadPromises = Object.entries(sizes).map(
        async ([sizeName, size]) => {
          const finalBuffer = await sharp(processedImageBuffer)
            .resize(size, size, { fit: 'cover' })
            .toBuffer();
          const processedKey = `avatars/${userId}-${sizeName}.jpeg`;

          const putCommand = new PutObjectCommand({
            Bucket: processedBucket,
            Key: processedKey,
            Body: finalBuffer,
            ContentType: 'image/jpeg',
          });
          await s3Client.send(putCommand);

          const finalUrl = `https://${processedBucket}.s3.${env.AWS_REGION}.amazonaws.com/${processedKey}`;
          processedUrls[sizeName] = finalUrl;
        }
      );

      await Promise.all(uploadPromises);
      logger.info(
        `All avatars sizes successfully processed for user ${userId}`,
        { urls: processedUrls }
      );

      const publisher = new UserAvatarProcessedPublisher();
      await publisher.publish({ userId, avatarUrls: processedUrls });
    } catch (error) {
      const err = error as Error;
      logger.error('Error processing avatar', { userId, error: err.message });

      const failurePublisher = new UserAvatarFailedPublisher();
      await failurePublisher.publish({
        userId,
        reason: err.message || 'An unknown processing error occurred.',
      });

      throw error;
    }
  }
}
