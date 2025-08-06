/**
 * @openapi
 * tags:
 *   - name: Courses
 *     description: High-level operations for creating, viewing, and managing entire courses.
 */

import { Router } from 'express';

import { CourseController, ModuleController } from '../controllers';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import {
  bulkCoursesSchema,
  createCourseSchema,
  createModuleSchema,
  listCoursesSchema,
  updateCoursePriceSchema,
} from '../schemas/course-schema';

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
 * /api/courses/stats:
 *   get:
 *     summary: Get course statistics
 *     tags: [Courses]
 *     description: Returns high-level statistics about courses. Requires admin access.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Course statistics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCourses:
 *                   type: number
 *                   example: 120
 *       '401':
 *         description: Unauthorized. Missing or invalid token.
 *       '403':
 *         description: Forbidden. Admin role required.
 */
router.get(
  '/stats',
  requireAuth,
  requireRole(['admin']),
  CourseController.getStats
);

/**
 * @openapi
 * /api/courses/admin-search:
 *   get:
 *     summary: Admin search for courses with pagination and optional query
 *     tags: [Courses]
 *     description: Retrieve a paginated list of all courses, optionally filtered by a search query. Admin access only.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: Search term to filter courses by title.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         required: false
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         required: false
 *         description: Number of courses to return per page.
 *     responses:
 *       200:
 *         description: Paginated list of courses with instructor information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Enriched course details (course + instructor)
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalResults:
 *                       type: integer
 *                       example: 42
 *       401:
 *         description: Unauthorized. User not logged in.
 *       403:
 *         description: Forbidden. User lacks admin privileges.
 */
router.get(
  '/admin-search',
  requireAuth,
  requireRole(['admin']),
  CourseController.searchForAdmin
);

/**
 * @openapi
 * /api/courses/public-search:
 *   get:
 *     summary: "Publicly search for published courses"
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: The search term for the course title.
 *     responses:
 *       '200':
 *         description: An array of courses matching the query.
 */
router.get('/public-search', CourseController.publicSearch);

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

/**
 * @openapi
 * /api/courses/{courseId}/modules:
 *   get:
 *     summary: Get all modules for a specific course
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
 *         description: An ordered list of the course's modules.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Module'
 */
router.post(
  '/:courseId/modules',
  requireAuth,
  requireRole(['admin', 'instructor']),
  validateRequest(createModuleSchema),
  ModuleController.create
);

/**
 * @openapi
 * /courses/{courseId}/thumbnail-upload-url:
 *   post:
 *     summary: Get signed thumbnail upload URL
 *     description: Request a pre-signed URL to upload a course thumbnail.
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - filename
 *             properties:
 *               filename:
 *                 type: string
 *                 description: Name of the image file to be uploaded
 *     responses:
 *       200:
 *         description: Signed upload URL and file URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uploadUrl:
 *                   type: string
 *                 fileUrl:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.post(
  '/:courseId/thumbnail-upload-url',
  requireAuth,
  requireRole(['instructor', 'admin']),
  CourseController.getThumbnailUploadUrl
);

/**
 * @openapi
 * /api/courses/{courseId}/price:
 *   patch:
 *     tags: [Courses]
 *     summary: Update course price
 *     description: Update the price of a course (admin/instructor only).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: courseId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               price:
 *                 type: number
 *                 nullable: true
 *                 minimum: 0
 *                 example: 19.99
 *     responses:
 *       200:
 *         description: Price updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Price updated.
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:courseId/price',
  requireAuth,
  requireRole(['admin', 'instructor']),
  validateRequest(updateCoursePriceSchema),
  CourseController.updatePrice
);

export { router as courseRouter };
