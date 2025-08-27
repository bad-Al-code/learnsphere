import { Router } from 'express';
import { z } from 'zod';
import { ResourceController } from '../controllers';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import {
  createResourceSchema,
  updateResourceSchema,
  uploadUrlSchema,
} from '../schemas';

const router = Router();
router.use(requireAuth, requireRole(['instructor', 'admin']));

/**
 * @openapi
 * /api/courses/{courseId}/resources:
 *   get:
 *     summary: Get all resources for a course
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of resources for the course
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Resource'
 */
router.get('/courses/:courseId/resources', ResourceController.getForCourse);

/**
 * @openapi
 * /api/courses/{courseId}/resources:
 *   post:
 *     summary: Create a new resource for a course
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateResourcePayload'
 *     responses:
 *       201:
 *         description: Resource created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       400:
 *         description: Invalid request data
 */
router.post(
  '/courses/:courseId/resources',
  validateRequest(z.object({ body: createResourceSchema })),
  ResourceController.create
);

/**
 * @openapi
 * /api/resources/{resourceId}:
 *   put:
 *     summary: Update an existing resource
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateResourcePayload'
 *     responses:
 *       200:
 *         description: Resource updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Resource'
 *       404:
 *         description: Resource not found
 */
router.put(
  '/resources/:resourceId',
  validateRequest(z.object({ body: updateResourceSchema })),
  ResourceController.update
);

/**
 * @openapi
 * /api/resources/{resourceId}:
 *   delete:
 *     summary: Delete a resource
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Resource deleted successfully
 *       404:
 *         description: Resource not found
 */
router.delete('/resources/:resourceId', ResourceController.delete);

/**
 * @openapi
 * /api/resources/{resourceId}/download:
 *   post:
 *     summary: "Track a resource download"
 *     tags: [Resources]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: resourceId
 *         required: true
 */
router.post(
  '/resources/:resourceId/download',
  requireAuth,
  ResourceController.downloadResource
);

/**
 * @openapi
 * /api/courses/{courseId}/resources/upload-url:
 *   post:
 *     summary: Get a signed upload URL for uploading a course resource
 *     tags:
 *       - Resources
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UploadUrlPayload'
 *     responses:
 *       200:
 *         description: Successfully generated upload URL
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post(
  '/courses/:courseId/resources/upload-url',
  validateRequest(z.object({ body: uploadUrlSchema })),
  ResourceController.getUploadUrl
);

export { router as resourceRouter };
