import { S3ClientService } from '../clients/s3.client';
import { env } from '../config/env';
import logger from '../config/logger';
import { MediaRepository } from '../db/media.repository';
import { SignedUrlResponse, UploadUrlParams } from '../types';

export class MediaService {
  /**
   * Generate a secure, time-limited presigned URL for uploading a file to S3.
   * @param param The parameters for the upload request.
   * @returns An object containing the presigned URL, the S3 object key and the finalUrl.
   */
  public static async getUploadUrl({
    uploadType,
    filename,
    metadata,
  }: UploadUrlParams): Promise<SignedUrlResponse> {
    const rawBucket = env.AWS_RAW_UPLOADS_BUCKET!;
    const processedBucket = env.AWS_PROCESSED_MEDIA_BUCKET;
    const region = env.AWS_REGION;
    const tagsToApply = { ...metadata, uploadType: uploadType };

    let key: string;
    let processedKey: string;

    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}-${filename}`;

    switch (uploadType) {
      case 'avatar':
        if (!metadata.userId)
          throw new Error('userId is required for avatar uploads');
        key = `uploads/avatars/${metadata.userId}/${Date.now()}-${filename}`;
        processedKey = `avatars/${metadata.userId}/large.jpeg`;
        break;

      case 'video':
        if (!metadata.lessonId)
          throw new Error('lessonId is required for video uploads');
        key = `uploads/videos/${metadata.lessonId}/${Date.now()}-${filename}`;
        processedKey = `videos/${metadata.courseId}/${uniqueFilename}/playlist.m3u8`;
        break;

      case 'course_thumbnail':
        if (!metadata.courseId)
          throw new Error('courseId is required for thumbnail uploads');
        key = `uploads/thumbnails/${metadata.courseId}/${Date.now()}-${filename}`;
        processedKey = `thumbnails/${metadata.courseId}/thumbnail.jpeg`;
        break;

      case 'course_resource':
        if (!metadata.courseId)
          throw new Error('courseId is required for resource uploads');
        key = `uploads/resources/${metadata.courseId}/${Date.now()}-${filename}`;
        processedKey = `resources/${metadata.courseId}/${uniqueFilename}`;
        break;

      case 'chat_attachment':
        if (!metadata.conversationId)
          throw new Error('conversationId is required for resource uploads');
        key = `uploads/chatAttachments/${metadata.conversationId}/${Date.now()}-${filename}`;
        processedKey = `chatAttachments/${metadata.conversationId}/${uniqueFilename}`;
        break;

      default:
        throw new Error('Invalid upload type');
    }

    logger.info(`Creating media asset record in database...`);
    await MediaRepository.create({
      s3Key: key,
      uploadType: uploadType,
      ownerUserId: metadata.userId || null,
      parentEntityId: metadata.lessonId || metadata.userId || metadata.courseId,
      status: 'uploading',
    });

    logger.info(`Generaiting pre-signed URL for key: ${key}`);

    const signedUrl = await S3ClientService.getPresignedUploadUrl(
      rawBucket,
      key,
      tagsToApply
    );

    const finalUrl = `https://${processedBucket}.s3.${region}.amazonaws.com/${processedKey}`;

    return { signedUrl, key, finalUrl };
  }
}
