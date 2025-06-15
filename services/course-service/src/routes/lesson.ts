import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateRequest } from "../middlewares/validate-request";
import { createLessonSchema, reorderSchema } from "../schemas/course-schema";
import { CourseService } from "../services/course-service";
import { StatusCodes } from "http-status-codes";

const router = Router();

router.get("/:lessonId", async (req: Request, res: Response) => {
  const { lessonId } = req.params;
  const lessonDetails = await CourseService.getLessonDetails(lessonId);

  res.status(StatusCodes.OK).json(lessonDetails);
});

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

router.delete(
  "/:lessonId",
  requireAuth,
  requireRole(["instructor", "admin"]),
  async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const requesterId = req.currentUser!.id;

    await CourseService.deleteLesson(lessonId, requesterId);

    res.status(StatusCodes.OK).json({ message: "Lesson deleted successfully" });
  }
);

router.post(
  "/reorder",
  requireAuth,
  requireRole(["instructor", "admin"]),
  validateRequest(reorderSchema),
  async (req: Request, res: Response) => {
    const { ids } = req.body;
    const requesterId = req.currentUser!.id;

    await CourseService.reorderLessons(ids, requesterId);

    res
      .status(StatusCodes.OK)
      .json({ message: "Lessons reordered successfully." });
  }
);

export { router as lessonRouter };
