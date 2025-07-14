/**
 * @openapi
 * tags:
 *   - name: Courses
 *     description: High-level operations for creating, viewing, and managing entire courses.
 */

import { Router } from 'express';

import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import {
  createCourseSchema,
  listCoursesSchema,
  bulkCoursesSchema,
  createModuleSchema,
} from '../schemas/course-schema';
import { CourseController } from '../controllers/course.controller';
import { ModuleController } from '../controllers/module.controller';

const router = Router();

/**
 * @openapi
 * /api/courses:
 *   get:
 *     summary: List all published courses with pagination
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *         description: The number of results per page.
 *     responses:
 *       '200':
 *         description: A paginated list of public course details.
 */
router.get('/', validateRequest(listCoursesSchema), CourseController.list);

/**
 * @openapi
 * /api/courses/bulk:
 *   post:
 *     summary: Get multiple public course details by their IDs
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       '200':
 *         description: An array of course objects.
 */
router.post(
  '/bulk',
  validateRequest(bulkCoursesSchema),
  CourseController.getBulk
);

/**
 * @openapi
 * /api/courses:
 *   post:
 *     summary: Create a new course (as an instructor or admin)
 *     tags: [Courses]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCoursePayload'
 *     responses:
 *       '201':
 *         description: The newly created course.
 */
router.post(
  '/',
  requireAuth,
  requireRole(['admin', 'instructor']),
  validateRequest(createCourseSchema),
  CourseController.create
);

/**
 * @openapi
 * /api/courses/{courseId}:
 *   get:
 *     summary: Get full details of a single course, including all modules and lessons
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: The complete course object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseDetails'
 */
router.get('/:courseId', CourseController.getById);

/**
 * @openapi
 * /api/courses/{courseId}:
 *   put:
 *     summary: Update a course's details
 *     tags: [Courses]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCoursePayload'
 *     responses:
 *       '200':
 *         description: The updated course.
 */
router.put(
  '/:courseId',
  requireAuth,
  requireRole(['instructor', 'admin']),
  validateRequest(createCourseSchema.partial()),
  CourseController.update
);

/**
 * @openapi
 * /api/courses/{courseId}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *     responses:
 *       '200':
 *         description: Course deleted successfully.
 */
router.delete(
  '/:courseId',
  requireAuth,
  requireRole(['instructor', 'admin']),
  CourseController.delete
);

/**
 * @openapi
 * /api/courses/{courseId}/publish:
 *   post:
 *     summary: Publish a course
 *     tags: [Courses]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *     responses:
 *       '200':
 *         description: The course with status 'published'.
 */
router.post(
  '/:courseId/publish',
  requireAuth,
  requireRole(['instructor', 'admin']),
  CourseController.publish
);

/**
 * @openapi
 * /api/courses/{courseId}/unpublish:
 *   post:
 *     summary: Unpublish a course
 *     tags: [Courses]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *     responses:
 *       '200':
 *         description: The course with status 'draft'.
 */
router.post(
  '/:courseId/unpublish',
  requireAuth,
  requireRole(['instructor', 'admin']),
  CourseController.unpublish
);

router.post(
  '/:courseId/modules',
  requireAuth,
  requireRole(['admin', 'instructor']),
  validateRequest(createModuleSchema),
  ModuleController.create
);

export { router as courseRouter };
