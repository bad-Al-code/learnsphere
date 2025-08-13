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

  /**
   * Requests a presigned URL for uploading a course thumbnail image.
   * @param courseId - The ID of the course this thumbnail belongs to.
   * @param filename - The original name of the image file.
   * @returns An object containing the presigned URL and the S3 key.
   */
  public static async requestCourseThumbnailUploadUrl(
    courseId: string,
    filename: string
  ): Promise<UploadUrlResponse> {
    logger.info(
      `Requesting video upload URL from media-service for lesson: ${courseId}`
    );
    try {
      const response = await axios.post(
        `${this.mediaServiceUrl}/api/media/request-upload-url`,
        {
          filename,
          uploadType: 'course_thumbnail',
          metadata: { courseId: courseId },
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

  /**
   * Request a signed upload URL for uploading a generic file to the media service.
   *
   * @param entityId - The entity ID associated with the file (e.g., courseId).
   * @param filename - The file name to be uploaded.
   * @param uploadType - The type/category of the upload (e.g., 'course_resource').
   * @returns A promise resolving to an object containing the signed upload URL and metadata.
   * @throws Error if the media service cannot be contacted or returns an error.
   */
  public static async requestGenericFileUpload(
    entityId: string,
    filename: string,
    uploadType: 'course_resource' | string
  ) {
    logger.info(
      `Requesting generic file upload URL from media-service for ${uploadType}: ${entityId}`
    );
    try {
      const response = await axios.post<UploadUrlResponse>(
        `${this.mediaServiceUrl}/api/media/request-upload-url`,
        {
          filename,
          uploadType,
          metadata: { courseId: entityId },
        }
      );
      return response.data;
    } catch (error) {
      logger.error(
        `Error contacting media-service for ${uploadType} upload URL`,
        { error }
      );
      throw new Error(`Could not create ${uploadType} upload URL.`);
    }
  }
}
