import { S3Client } from "../clients/s3.client";
import logger from "../config/logger";

export interface UploadUrlParams {
  filename: string;
  uploadType: "avatar" | "video";
  metadata: Record<string, string>;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
}

export class MediaService {
  /**
   * Generates a secure, presigned URL for a client to upload a file directly to S3.
   * @param params The paramerts for the upload request
   * @returns An object containing the presigned URL and the S3 object key.
   */
  public static async getPresignedUploadUrl(
    params: UploadUrlParams
  ): Promise<PresignedUrlResponse> {
    const { filename, metadata, uploadType } = params;

    let key: string;

    switch (uploadType) {
      case "avatar":
        if (!metadata.userId) {
          throw new Error(`userId is required in metadata for avatar uploads`);
        }

        key = `upload/avatars/${metadata.userId}/${Date.now()}-${filename}`;
        break;
      case "video":
        if (!metadata.lessonId) {
          throw new Error(`lessonId is required in metadata for video uploads`);
        }

        key = `uploads/videos/${metadata.lessonId}/${Date.now()}-${filename}`;
        break;
      default:
        throw new Error("Invalid upload type specified");
    }

    logger.info(`Generating pre-signed URL for key: ${key}`);

    const uploadUrl = await S3Client.generatePresignedPutUrl(key, metadata);

    return { uploadUrl, key };
  }
}
