import { Router } from 'express';
import { z } from 'zod';
import { AssignmentController } from '../controllers/assignment.controller';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import { assignmentSchema, updateAssignmentSchema } from '../schemas';

const router = Router();
router.use(requireAuth, requireRole(['instructor', 'admin']));

/**
 * @openapi
 * /api/modules/{moduleId}/assignments:
 *   post:
 *     summary: Create a new assignment for a module
 *     tags:
 *       - Assignments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: moduleId
 *         in: path
 *         description: The ID of the module to add the assignment to
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Assignment object to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentCreate'
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 */
router.post(
  '/modules/:moduleId/assignments',
  validateRequest(z.object({ body: assignmentSchema })),
  AssignmentController.create
);

/**
 * @openapi
 * /api/assignments/{assignmentId}:
 *   put:
 *     summary: Update an assignment
 *     tags:
 *       - Assignments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: assignmentId
 *         in: path
 *         description: The ID of the assignment to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Assignment object with updated data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentUpdate'
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 */
router.put(
  '/assignments/:assignmentId',
  validateRequest(z.object({ body: updateAssignmentSchema })),
  AssignmentController.update
);

/**
 * @openapi
 * /api/assignments/{assignmentId}:
 *   delete:
 *     summary: Delete an assignment
 *     tags:
 *       - Assignments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: assignmentId
 *         in: path
 *         description: The ID of the assignment to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Assignment deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Assignment deleted successfully
 */
router.delete('/assignments/:assignmentId', AssignmentController.delete);

/**
 * @openapi
 * /api/assignments/reorder:
 *   post:
 *     summary: Reorder assignments within a module
 *     tags:
 *       - Assignments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Object containing moduleId and array of assignment order updates
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - moduleId
 *               - items
 *             properties:
 *               moduleId:
 *                 type: string
 *                 description: The ID of the module containing the assignments
 *               items:
 *                 type: array
 *                 description: Array of assignment order updates
 *                 items:
 *                   type: object
 *                   required:
 *                     - id
 *                     - order
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Assignment ID
 *                     order:
 *                       type: integer
 *                       description: New order value
 *     responses:
 *       200:
 *         description: Assignments reordered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Assignments reordered successfully
 */
router.post('/assignments/reorder', AssignmentController.reorder);

/**
 * @openapi
 * /assignments/my-pending-count:
 *   get:
 *     summary: Get the count of pending assignments for the current user
 *     description: Returns the total number of assignments that the authenticated user still has pending across their enrolled courses.
 *     tags:
 *       - Assignments
 *     security:
 *       - cookieAuth: []   # assuming you use cookie-based auth
 *     responses:
 *       '200':
 *         description: Successfully retrieved the count of pending assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 3
 *       '401':
 *         description: Unauthorized - missing or invalid authentication
 *       '500':
 *         description: Internal server error
 */
router.get(
  '/assignments/my-pending-count',
  requireAuth,
  AssignmentController.getMyPendingCount
);

/**
 * @openapi
 * /api/assignments/my-pending:
 *   get:
 *     summary: "[Student] Get a list of pending assignments with filters"
 *     tags: [Assignments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *         description: Search term for assignment title.
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [not-started, in-progress] }
 *         description: Filter by submission status.
 *     responses:
 *       '200':
 *         description: A list of the student's pending assignments.
 */
router.get(
  '/assignments/my-pending',
  requireAuth,
  AssignmentController.getMyPending
);

/**
 * @openapi
 * /api/assignments/due-soon-count:
 *   get:
 *     summary: "[Student] Get a count of assignments due soon"
 *     tags:
 *       - Assignments
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: A count of assignments due in the next 7 days
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 3
 */
router.get(
  '/assignments/due-soon-count',
  requireAuth,
  AssignmentController.getDueSoonCount
);

/**
 * @openapi
 * /api/courses/{courseId}/assignments:
 *   get:
 *     summary: Get assignments for a course with filters and pagination.
 *     tags:
 *       - Assignments
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The course ID to fetch assignments for.
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Filter assignments by title containing this string.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, published]
 *         description: Filter assignments by status.
 *       - in: query
 *         name: moduleId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter assignments by module ID.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for paginated results.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *         description: Number of assignments per page.
 *     responses:
 *       200:
 *         description: A paginated list of assignments.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Assignment'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalResults:
 *                       type: integer
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Internal server error.
 */
router.get('/courses/:courseId/assignments', AssignmentController.getForCourse);

/**
 * @openapi
 * /api/courses/{courseId}/assignment-status:
 *   get:
 *     summary: "[Instructor] Get status and stats for all assignments in a course"
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: An array of assignment statuses including submission counts and average grades.
 */
router.get(
  '/courses/:courseId/assignment-status',
  AssignmentController.getStatusesForCourse
);

export { router as assignmentRouter };
