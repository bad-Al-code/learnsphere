import { eq } from 'drizzle-orm';
import { db } from '.';
import { NewMediaAsset, MediaAsset, UpdateMediaAsset } from '../types';
import { mediaAssets } from './schema';

export class MediaRepository {
  /**
   * Creates a new media asses record.
   * @param data The data for the new asset.
   * @returns The newly created media asset.
   */
  public static async create(data: NewMediaAsset): Promise<MediaAsset> {
    const [newAsset] = await db.insert(mediaAssets).values(data).returning();

    return newAsset;
  }

  /**
   * Updates a media asset record by its S3 key.
   * @param s3Key The unique S3 key of the asses to update.
   * @param data The fields to update
   * @returns The updated media asset or null if not found.
   */
  public static async updateByS3Key(
    s3Key: string,
    data: UpdateMediaAsset
  ): Promise<MediaAsset | null> {
    const [updatedAsset] = await db
      .update(mediaAssets)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(mediaAssets.s3Key, s3Key))
      .returning();

    return updatedAsset || null;
  }
}
