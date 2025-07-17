import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

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
import { EnrollmentService } from '../services/enrollment.service';

const router = Router();

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

router.get('/my-courses', requireAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;
  const enrollments = await EnrollmentService.getEnrollmentsByUserId(userId);

  res.status(StatusCodes.OK).json(enrollments);
});

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

export { router as enrollmentRouter };
