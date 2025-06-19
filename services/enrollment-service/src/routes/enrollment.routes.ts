import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

import { requireAuth } from "../middlewares/require-auth";
import { validateRequest } from "../middlewares/validate-request";
import {
  createEnrollmentSchema,
  manualEnrollmentSchema,
  markProgressSchema,
} from "../schema/enrollment.schema";
import { EnrollmentService } from "../services/enrollment.service";
import { requireRole } from "../middlewares/require-role";

const router = Router();

router.post(
  "/",
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

router.get("/my-courses", requireAuth, async (req: Request, res: Response) => {
  const userId = req.currentUser!.id;
  const enrollments = await EnrollmentService.getEnrollmentsByUserId(userId);

  res.status(StatusCodes.OK).json(enrollments);
});

router.post(
  "/progress",
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
      message: "Progress updated successfully",
      progress: updatedEnrollment.progress,
      progressPercentage: updatedEnrollment.progressPercentage,
    });
  }
);

router.post(
  "/manual",
  requireAuth,
  requireRole(["instructor", "admin"]),
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

export { router as enrollmentRouter };
