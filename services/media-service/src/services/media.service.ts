import { S3ClientService } from '../clients/s3.client';
import { env } from '../config/env';
import logger from '../config/logger';
import { MediaRepository } from '../db/media.repository';
import { SignedUrlResponse, UploadUrlParams } from '../types';

export class MediaService {
  /**
   * Generate a secure, time-limited presigned URL for uploading a file to S3.
   * @param param The parameters for the upload request.
   * @returns An object containing the presigned URL and the S3 object key.
   */
  public static async getUploadUrl({
    uploadType,
    filename,
    metadata,
  }: UploadUrlParams): Promise<SignedUrlResponse> {
    const rawBucket = env.AWS_RAW_UPLOADS_BUCKET!;
    const tagsToApply = { ...metadata, uploadType: uploadType };

    let key: string;
    switch (uploadType) {
      case 'avatar':
        if (!metadata.userId)
          throw new Error('userId is required for avatar uploads');
        key = `uploads/avatars/${metadata.userId}/${Date.now()}-${filename}`;
        break;

      case 'video':
        if (!metadata.lessonId)
          throw new Error('lessonId is required for video uploads');
        key = `uploads/videos/${metadata.lessonId}/${Date.now()}-${filename}`;
        break;

      case 'course_thumbnail':
        if (!metadata.courseId)
          throw new Error('courseId is required for thumbnail uploads');
        key = `uploads/thumbnails/${metadata.courseId}/${Date.now()}-${filename}`;
        break;

      default:
        throw new Error('Invalid upload type');
    }

    logger.info(`Creating media asset record in database...`);
    await MediaRepository.create({
      s3Key: key,
      uploadType: uploadType,
      ownerUserId: metadata.userId || null,
      parentEntityId: metadata.lessonId || metadata.userId,
      status: 'uploading',
    });

    logger.info(`Generaiting pre-signed URL for key: ${key}`);

    const signedUrl = await S3ClientService.getPresignedUploadUrl(
      rawBucket,
      key,
      tagsToApply
    );

    return { signedUrl, key };
  }
}
