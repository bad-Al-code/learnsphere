import sharp from 'sharp';
import { env } from '../config/env';
import { S3ClientService } from './s3.client';
import logger from '../config/logger';
import { ProcessedAvatarUrls } from '../types';

export class ImageClient {
  private static readonly SIZES = { small: 50, medium: 200, large: 800 };

  /**
   * Takes a raw image buffer, resizes it into multiple standard avatar sizes, and uploads to the processed S3 bucket.
   * @param imageBuffer The raw image data
   * @param userId The ID of the user this avatar belongs to.
   * @returns An object containing the public URLs for each resized avatar.
   */
  public static async processAndUploadAvatar(
    imageBuffer: Buffer,
    userId: string
  ): Promise<ProcessedAvatarUrls> {
    const processedBucket = env.AWS_PROCESSED_MEDIA_BUCKET;
    const region = env.AWS_REGION;
    const processedUrls: Partial<ProcessedAvatarUrls> = {};

    const baseImageBuffer = await sharp(imageBuffer)
      .jpeg({ quality: 90 })
      .toBuffer();

    const uploadPromises = Object.entries(this.SIZES).map(
      async ([sizeName, size]) => {
        const finalBuffer = await sharp(baseImageBuffer)
          .resize(size, size, { fit: 'cover' })
          .toBuffer();

        const processedKey = `avatars/${userId}/${sizeName}.jpeg`;

        await S3ClientService.uploadBuffer(
          processedBucket,
          processedKey,
          finalBuffer,
          'image/jpeg'
        );

        const finalUrl = `https://${processedBucket}.s3.${region}.amazonaws.com/${processedKey}`;

        processedUrls[sizeName as keyof ProcessedAvatarUrls] = finalUrl;
      }
    );

    await Promise.all(uploadPromises);

    logger.info(
      `All avatar sizes successfully processed and uploaded for user ${userId}`,
      { urls: processedUrls }
    );

    return processedUrls as ProcessedAvatarUrls;
  }
}
