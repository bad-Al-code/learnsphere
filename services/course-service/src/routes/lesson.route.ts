/**
 * @openapi
 * tags:
 *   - name: Lessons
 *     description: Operations for managing individual lessons. Lessons are children of Modules.
 */
import { Router } from 'express';

import { LessonController } from '../controllers';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import {
  reorderSchema,
  updateLessonSchema,
  videoUploadUrlSchema,
} from '../schemas';

const router = Router();

/**
 * @openapi
 * /api/lessons/{lessonId}:
 *   get:
 *     summary: Get details of a single lesson, including its content
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: The lesson object with its content.
 */
router.get('/:lessonId', LessonController.getById);

/**
 * @openapi
 * /api/lessons/{lessonId}:
 *   put:
 *     summary: Update a lesson's details
 *     tags: [Lessons]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateLessonPayload'
 *     responses:
 *       '200':
 *         description: The updated lesson.
 */
router.put(
  '/:lessonId',
  requireAuth,
  requireRole(['instructor', 'admin']),
  validateRequest(updateLessonSchema),
  LessonController.update
);

/**
 * @openapi
 * /api/lessons/{lessonId}:
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Lessons]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *     responses:
 *       '200':
 *         description: Lesson deleted successfully.
 */
router.delete(
  '/:lessonId',
  requireAuth,
  requireRole(['instructor', 'admin']),
  LessonController.delete
);

/**
 * @openapi
 * /api/lessons/reorder:
 *   post:
 *     summary: Reorder a list of lessons within a module
 *     tags: [Lessons]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReorderPayload'
 *     responses:
 *       '200':
 *         description: Lessons reordered successfully.
 */
router.post(
  '/reorder',
  requireAuth,
  requireRole(['instructor', 'admin']),
  validateRequest(reorderSchema),
  LessonController.reorder
);

/**
 * @openapi
 * /api/lessons/{lessonId}/request-video-upload:
 *   post:
 *     summary: Get a presigned URL to upload a video for a lesson
 *     tags: [Lessons]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               filename:
 *                 type: string
 *     responses:
 *       '200':
 *         description: The presigned URL and S3 key.
 */
router.post(
  '/:lessonId/request-video-upload',
  requireAuth,
  requireRole(['instructor', 'admin']),
  validateRequest(videoUploadUrlSchema),
  LessonController.requestVideoUploadUrl
);

export { router as lessonRouter };
