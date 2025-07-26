import { Router } from 'express';

import { validateRequest } from '../middlewares/validate-request';
import { requestUploadUrlSchema } from '../schemas/media-schema';
import { MediaController } from '../controllers/media.controller';

const router = Router();

/**
 * @openapi
 * /api/media/request-upload-url:
 *   post:
 *     summary: Request a presigned URL for a direct file upload
 *     tags:
 *       - Media
 *     description: |
 *       Generates a secure, time-limited URL that a client can use to upload a file directly to the raw S3 bucket.
 *       The `metadata` field is crucial for the background worker to correctly process the file after upload.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RequestUploadUrlBody'
 *     responses:
 *       '200':
 *         description: Successfully generated presigned URL.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RequestUploadUrlResponse'
 *       '400':
 *         description: Invalid request body.
 */
router.post(
  '/request-upload-url',
  validateRequest(requestUploadUrlSchema),
  MediaController.getUploadUrl
);

export { router as mediaRouter };
