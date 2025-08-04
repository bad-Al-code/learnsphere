/**
 * @openapi
 * tags:
 *   - name: Student Enrollments
 *     description: Operations for students to manage their own course enrollments and progress.
 *   - name: Admin & Instructor
 *     description: Administrative operations for managing student enrollments.
 */

import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { EnrollmentService } from '../controllers/enrollment.service';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import {
  createEnrollmentSchema,
  enrollmentIdParamSchema,
  getEnrollmentsSchema,
  manualEnrollmentSchema,
  markProgressSchema,
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
  async (req: Request, res: Response) => {
    const { courseId } = req.body;
    const userId = req.currentUser!.id;

    const enrollment = await EnrollmentService.enrollUserInCourse({
      userId,
      courseId,
    });

    res.status(StatusCodes.CREATED).json(enrollment);
  }
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
router.get('/my-courses', requireAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;
  const enrollments = await EnrollmentService.getEnrollmentsByUserId(userId);

  res.status(StatusCodes.OK).json(enrollments);
});

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
  async (req: Request, res: Response) => {
    const { courseId, lessonId } = req.body;
    const userId = req.currentUser!.id;

    const updatedEnrollment = await EnrollmentService.markLessonAsComplete({
      userId,
      courseId,
      lessonId,
    });

    res.status(StatusCodes.OK).json({
      message: 'Progress updated successfully',
      progress: updatedEnrollment.progress,
      progressPercentage: updatedEnrollment.progressPercentage,
    });
  }
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
router.get('/check/:courseId', requireAuth, EnrollmentService.checkEnrollment);

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
  async (req: Request, res: Response) => {
    const { enrollmentId } = req.params;
    const requesterId = req.currentUser!.id;

    await EnrollmentService.resetEnrollmentProgress({
      enrollmentId,
      requesterId,
    });

    res
      .status(StatusCodes.OK)
      .json({ message: 'Course progress has been successfully reset' });
  }
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
  async (req: Request, res: Response) => {
    const { userId, courseId } = req.body;
    const requester = req.currentUser!;

    const enrollment = await EnrollmentService.enrollUserManually({
      userId,
      courseId,
      requester,
    });

    res.status(StatusCodes.CREATED).json(enrollment);
  }
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
  async (req: Request, res: Response) => {
    const { enrollmentId } = req.params;
    const requester = req.currentUser!;

    await EnrollmentService.suspendEnrollment({ enrollmentId, requester });

    res
      .status(StatusCodes.OK)
      .json({ message: 'Enrollment suspended succesfully' });
  }
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
  async (req: Request, res: Response) => {
    const { enrollmentId } = req.params;
    const requester = req.currentUser!;

    await EnrollmentService.reinstateEnrollment({ enrollmentId, requester });

    res
      .status(StatusCodes.OK)
      .json({ message: 'Enrollment reinstated succesfully' });
  }
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
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const { page, limit } = getEnrollmentsSchema.shape.query.parse(req.query);
    const requester = req.currentUser!;

    const result = await EnrollmentService.getEnrollmentsByCourseId({
      courseId,
      requester,
      page,
      limit,
    });

    res.status(StatusCodes.OK).json(result);
  }
);

export { router as enrollmentRouter };
