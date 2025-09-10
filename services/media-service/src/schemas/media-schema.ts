import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     RequestUploadUrlBody:
 *       type: object
 *       required:
 *         - filename
 *         - uploadType
 *         - metadata
 *       properties:
 *         filename:
 *           type: string
 *           description: The name of the file to be uploaded.
 *           example: 'my-cool-video.mp4'
 *         uploadType:
 *           type: string
 *           enum: [avatar, video, course_thumbnail, course_resource, chat_attachment]
 *           description: The type of media being uploaded.
 *         metadata:
 *           type: object
 *           description: An object containing metadata relevant to the upload type (e.g., userId for avatar, lessonId for video).
 *           example:
 *             userId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
 *     RequestUploadUrlResponse:
 *       type: object
 *       properties:
 *         signedUrl:
 *           type: string
 *           format: url
 *           description: The presigned S3 URL for the client to upload the file to.
 *         key:
 *           type: string
 *           description: The S3 object key where the file will be stored.
 */
export const requestUploadUrlSchema = z.object({
  body: z.object({
    filename: z.string({ required_error: 'Filename is required' }),
    uploadType: z.enum([
      'avatar',
      'video',
      'course_thumbnail',
      'course_resource',
      'chat_attachment',
    ]),
    metadata: z.record(z.string()),
  }),
});
