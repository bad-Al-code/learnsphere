import axios from 'axios';

import { env } from '../config/env';
import logger from '../config/logger';

interface UploadUrlResponse {
  signedUrl: string;
  key: string;
}

export class MediaClient {
  private static mediaServiceUrl = env.MEDIA_SERVICE_URL;

  /**
   * Requests a presigned URL for uploading a lesson video.
   * @param lessonId - The ID of the lesson the video belongs to.
   * @param filename - The original name of the video file.
   * @returns An object containing the presigned URL and the S3 key.
   */
  public static async requestVideoUploadUrl(
    lessonId: string,
    filename: string
  ): Promise<UploadUrlResponse> {
    logger.info(
      `Requesting video upload URL from media-service for lesson: ${lessonId}`
    );
    try {
      const response = await axios.post<UploadUrlResponse>(
        `${this.mediaServiceUrl}/api/media/request-upload-url`,
        {
          filename,
          uploadType: 'video',
          metadata: { lessonId: lessonId },
        }
      );
      return response.data;
    } catch (error) {
      logger.error('Error contacting media-service for video upload URL', {
        error:
          error instanceof axios.AxiosError ? error.message : String(error),
      });

      throw new Error('Could not create video upload URL.');
    }
  }
}
