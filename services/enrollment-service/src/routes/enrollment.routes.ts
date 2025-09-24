/**
 * @openapi
 * tags:
 *   - name: Student Enrollments
 *     description: Operations for students to manage their own course enrollments and progress.
 *   - name: Admin & Instructor
 *     description: Administrative operations for managing student enrollments.
 */

import { Router } from 'express';

import { EnrollmentController } from '../controllers/enrollment.controller';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import {
  createEnrollmentSchema,
  endSessionSchema,
  enrollmentIdParamSchema,
  getEnrollmentsSchema,
  manualEnrollmentSchema,
  markProgressSchema,
  startSessionSchema,
} from '../schema/enrollment.schema';

const router = Router();

/**
 * @openapi
 * /api/enrollments:
 *   post:
 *     summary: Enroll the current user in a course
 *     tags: [Student Enrollments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEnrollmentPayload'
 *     responses:
 *       '201':
 *         description: Successfully enrolled in the course.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 */
router.post(
  '/',
  requireAuth,
  validateRequest(createEnrollmentSchema),
  EnrollmentController.enrollUserInCourse
);

/**
 * @openapi
 * /api/enrollments/my-courses:
 *   get:
 *     summary: Get all courses the current user is enrolled in
 *     tags: [Student Enrollments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: A list of the user's enrollments with course details.
 */
router.get('/my-courses', requireAuth, EnrollmentController.getMyCourses);

/**
 * @openapi
 * /api/enrollments/my-course-ids:
 *   get:
 *     summary: Get IDs of all courses the current user is enrolled in
 *     tags:
 *       - Student Enrollments
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: An array of course UUIDs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get('/my-course-ids', requireAuth, EnrollmentController.getMyCourseIds);

/**
 * @openapi
 * /api/enrollments/progress:
 *   post:
 *     summary: Mark a lesson as complete for the current user
 *     tags: [Student Enrollments]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MarkProgressPayload'
 *     responses:
 *       '200':
 *         description: Progress successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProgressResponse'
 */
router.post(
  '/progress',
  requireAuth,
  validateRequest(markProgressSchema),
  EnrollmentController.markProgress
);

/**
 * @openapi
 * /api/enrollments/session/start:
 *   post:
 *     summary: Log the start of a lesson viewing session
 *     tags: [Student Enrollments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Session started, returns sessionId.
 */
router.post(
  '/session/start',
  requireAuth,
  validateRequest(startSessionSchema),
  EnrollmentController.startSession
);

/**
 * @openapi
 * /api/enrollments/session/end:
 *   post:
 *     summary: Log the end of a lesson viewing session
 *     tags: [Student Enrollments]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: Session end logged.
 */
router.post(
  '/session/end',
  requireAuth,
  validateRequest(endSessionSchema),
  EnrollmentController.endSession
);

/**
 * @openapi
 * /api/enrollments/check/{courseId}:
 *   get:
 *     summary: Check if the current user is enrolled in a specific course
 *     tags: [Student Enrollments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to check enrollment for
 *     responses:
 *       '200':
 *         description: The user is actively enrolled in the course.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Enrollment'
 *       '404':
 *         description: Enrollment not found or inactive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/check/:courseId',
  requireAuth,
  EnrollmentController.checkEnrollment
);

/**
 * @openapi
 * /api/enrollments/{enrollmentId}/reset-progress:
 *   post:
 *     summary: Reset the progress for an enrollment (student's own)
 *     tags: [Student Enrollments]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '200':
 *         description: Progress successfully reset.
 */
router.post(
  '/:enrollmentId/reset-progress',
  requireAuth,
  validateRequest(enrollmentIdParamSchema),
  EnrollmentController.resetProgress
);

/**
 * @openapi
 * /api/enrollments/manual:
 *   post:
 *     summary: "[Admin/Instructor] Manually enroll a user in a course"
 *     tags: [Admin & Instructor]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *               courseId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       '201':
 *         description: User successfully enrolled.
 */
router.post(
  '/manual',
  requireAuth,
  requireRole(['instructor', 'admin']),
  validateRequest(manualEnrollmentSchema),
  EnrollmentController.manualEnrollment
);

/**
 * @openapi
 * /api/enrollments/{enrollmentId}/suspend:
 *   post:
 *     summary: "[Admin/Instructor] Suspend a user's enrollment"
 *     tags: [Admin & Instructor]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *     responses:
 *       '200':
 *         description: Enrollment suspended.
 */
router.post(
  '/:enrollmentId/suspend',
  requireAuth,
  requireRole(['instructor', 'admin']),
  validateRequest(enrollmentIdParamSchema),
  EnrollmentController.suspendEnrollment
);

/**
 * @openapi
 * /api/enrollments/{enrollmentId}/reinstate:
 *   post:
 *     summary: "[Admin/Instructor] Reinstate a suspended enrollment"
 *     tags: [Admin & Instructor]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: enrollmentId
 *         required: true
 *     responses:
 *       '200':
 *         description: Enrollment reinstated.
 */
router.post(
  '/:enrollmentId/reinstate',
  requireAuth,
  requireRole(['instructor', 'admin']),
  validateRequest(enrollmentIdParamSchema),
  EnrollmentController.reinstateEnrollment
);

/**
 * @openapi
 * /api/enrollments/course/{courseId}:
 *   get:
 *     summary: "[Admin/Instructor] Get all enrollments for a course"
 *     tags: [Admin & Instructor]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       '200':
 *         description: A paginated list of enrollments for the course.
 */
router.get(
  '/course/:courseId',
  requireAuth,
  requireRole(['admin', 'instructor']),
  validateRequest(getEnrollmentsSchema),
  EnrollmentController.getEnrollmentsForCourse
);

/**
 * @openapi
 * /api/enrollments/status/{courseId}/{userId}:
 *   get:
 *     summary: "[Internal] Check enrollment status for a user in a course"
 *     tags:
 *       - Admin & Instructor & Student
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Returns the enrollment status.
 */
router.get('/status/:courseId/:userId', EnrollmentController.checkEnrollment);

export { router as enrollmentRouter };
