import { Router } from 'express';
import { z } from 'zod';
import { AssignmentController } from '../controllers/assignment.controller';
import {
  requireAuth,
  requireAuthOrInternal,
} from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import {
  assignmentParamsSchema,
  assignmentSchema,
  bulkAssignmentsByCoursesSchema,
  bulkAssignmentsSchema,
  requestReGradeParamsSchema,
  submissionIdParamsSchema,
  updateAssignmentSchema,
} from '../schemas';

const router = Router();

/**
 * @openapi
 * /api/assignments/bulk:
 *   post:
 *     summary: Get multiple assignments by their IDs
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignmentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       '200':
 *         description: An array of assignment objects.
 */
router.post(
  '/assignments/bulk',
  requireAuthOrInternal,
  validateRequest(bulkAssignmentsSchema),
  AssignmentController.getBulk
);

/**
 * @openapi
 * /api/courses/assignments/bulk:
 *   post:
 *     summary: Get all assignments for multiple courses by their IDs
 *     tags: [Assignments]
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
 *         description: An array of all assignment objects for the given courses.
 */
router.post(
  '/courses/assignments/bulk',
  requireAuthOrInternal,
  validateRequest(bulkAssignmentsByCoursesSchema),
  AssignmentController.getBulkByCourses
);

/**
 * @openapi
 * /api/assignments/upcoming-for-courses:
 *   post:
 *     summary: "[Internal] Get all upcoming assignments for a set of courses"
 *     tags: [Assignments]
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
 *         description: An array of upcoming assignment objects.
 */
router.post(
  '/assignments/upcoming-for-courses',
  requireAuthOrInternal,
  validateRequest(bulkAssignmentsByCoursesSchema),
  AssignmentController.getUpcomingForCourses
);

/**
 * @openapi
 * /api/assignments/submissions/{submissionId}/content:
 *   get:
 *     summary: "[Student] Get the content of a single submission"
 *     tags: [Assignments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: The content of the submission.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden. User does not own this submission.
 *       '404':
 *         description: Submission not found.
 */
router.get(
  '/assignments/submissions/:submissionId/content',
  requireAuthOrInternal,
  validateRequest(submissionIdParamsSchema),
  AssignmentController.getSubmissionContent
);

/**
 * @openapi
 * /api/assignments/submissions/{submissionId}/request-re-grade:
 *   post:
 *     summary: "[Student] Request an AI re-grade for a submission"
 *     tags: [Assignments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Re-grade request has been accepted for processing.
 *       '401':
 *         description: Unauthorized.
 *       '403':
 *         description: Forbidden. User does not own this submission.
 *       '404':
 *         description: Submission not found.
 */
router.post(
  '/assignments/submissions/:submissionId/request-re-grade',
  requireAuthOrInternal,
  validateRequest(requestReGradeParamsSchema),
  AssignmentController.requestReGrade
);

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
 * /api/assignments/bulk:
 *   post:
 *     summary: Get multiple assignments by their IDs
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignmentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       '200':
 *         description: An array of assignment objects.
 */
router.post(
  '/assignments/bulk',
  validateRequest(bulkAssignmentsSchema),
  AssignmentController.getBulk
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
 * /api/assignments/my-submitted:
 *   get:
 *     summary: "[Student] Get a list of all submitted assignments"
 *     tags: [Assignments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: A list of the student's submitted assignments.
 */
router.get(
  '/assignments/my-submitted',
  requireAuth,
  AssignmentController.getMySubmitted
);

/**
 * @openapi
 * /assignments/{assignmentId}/start:
 *   post:
 *     summary: Mark an assignment as in-progress
 *     tags:
 *       - Assignments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assignmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the assignment to start
 *     responses:
 *       200:
 *         description: Assignment marked as in-progress
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Assignment marked as in-progress.
 *       400:
 *         description: Invalid path parameters
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/assignments/:assignmentId/start',
  requireAuth,
  validateRequest(assignmentParamsSchema),
  AssignmentController.startAssignment
);

/**
 * @openapi
 * /assignments/draft-statuses:
 *   post:
 *     summary: Get draft statuses for multiple assignments for the current user
 *     tags:
 *       - Assignments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DraftStatusesRequest'
 *     responses:
 *       200:
 *         description: Array of assignment IDs that have drafts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Internal server error
 */
router.post(
  '/assignments/draft-statuses',
  requireAuth,
  AssignmentController.getMyDraftStatuses
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
