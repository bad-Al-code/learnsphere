import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateRequest } from "../middlewares/validate-request";
import { CourseService } from "../controllers/course-service";
import { StatusCodes } from "http-status-codes";
import {
  videoUploadUrlSchema,
  createLessonSchema,
  reorderSchema,
} from "../schemas";

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

router.post(
  "/:lessonId/request-video-upload",
  requireAuth,
  requireRole(["instructor", "admin"]),
  validateRequest(videoUploadUrlSchema),
  async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const { filename } = req.body;
    const requesterId = req.currentUser!.id;

    const uploadData = await CourseService.requestVideoUploadUrl(
      lessonId,
      filename,
      requesterId
    );

    res.status(StatusCodes.OK).json(uploadData);
  }
);

export { router as lessonRouter };
