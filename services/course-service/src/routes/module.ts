import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateRequest } from "../middlewares/validate-request";
import { createLessonSchema } from "../schemas/course-schema";
import { CourseService } from "../services/course-service";

const router = Router();

router.post(
  "/:moduleId/lessons",
  requireAuth,
  requireRole(["admin", "instructor"]),
  validateRequest(createLessonSchema),
  async (req: Request, res: Response) => {
    const { moduleId } = req.params;
    const { title, lessonType } = req.body;
    const requesterId = req.currentUser!.id;

    const lesson = await CourseService.addLessonToModule(
      { title, moduleId, lessonType },
      requesterId
    );

    res.status(StatusCodes.CREATED).json(lesson);
  }
);

export { router as moduleRouter };
