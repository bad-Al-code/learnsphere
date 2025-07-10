import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import logger from '../config/logger';
import { s3Client } from '../config/s3Client';
import { env } from '../config/env';

export interface UploadUrlParams {
  filename: string;
  uploadType: 'avatar' | 'video';
  metadata: Record<string, string>;
}

export interface SignedUrlResponse {
  signedUrl: string;
  key: string;
}

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
      default:
        throw new Error('Invalid upload type');
    }

    logger.info(`Generaiting pre-signed URL for key: ${key}`);

    const command = new PutObjectCommand({
      Bucket: rawBucket,
      Key: key,
      Tagging: new URLSearchParams(tagsToApply).toString(),
    });

    const signedUrlExpiresIn = 600;
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: signedUrlExpiresIn,
    });

    return { signedUrl, key };
  }
}
