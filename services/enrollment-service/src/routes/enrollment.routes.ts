import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

import { requireAuth } from "../middlewares/require-auth";
import { validateRequest } from "../middlewares/validate-request";
import {
  createEnrollmentSchema,
  markProgressSchema,
} from "../schema/enrollment.schema";
import { EnrollmentService } from "../services/enrollment.service";

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

export { router as enrollmentRouter };
