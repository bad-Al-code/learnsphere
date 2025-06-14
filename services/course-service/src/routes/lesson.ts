import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateRequest } from "../middlewares/validate-request";
import { createLessonSchema } from "../schemas/course-schema";
import { CourseService } from "../services/course-service";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.put(
  "/:lessonId",
  requireAuth,
  requireRole(["instructor", "admin"]),
  validateRequest(createLessonSchema.partial()),
  async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const updatedData = req.body;
    const requesterId = req.currentUser!.id;

    const updatedLesson = await CourseService.updateLesson(
      lessonId,
      updatedData,
      requesterId
    );

    res.status(StatusCodes.OK).json(updatedLesson);
  }
);

export { router as lessonRouter };
