import e, { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateRequest } from "../middlewares/validate-request";
import {
  createLessonSchema,
  createModuleSchema,
} from "../schemas/course-schema";
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

router.put(
  "/:moduleId",
  requireAuth,
  requireRole(["instructor", "admin"]),
  validateRequest(createModuleSchema),
  async (req: Request, res: Response) => {
    const { moduleId } = req.params;
    const { title } = req.body;
    const requesterId = req.currentUser!.id;

    const updatedModule = await CourseService.updateModule(
      moduleId,
      { title },
      requesterId
    );

    res.status(StatusCodes.OK).json(updatedModule);
  }
);

router.delete(
  "/:moduleId",
  requireAuth,
  requireRole(["instructor", "admin"]),
  async (req: Request, res: Response) => {
    const { moduleId } = req.params;
    const requesterId = req.currentUser!.id;

    await CourseService.deleteModule(moduleId, requesterId);

    res.status(StatusCodes.OK).json({ message: "Module deleted successfully" });
  }
);

export { router as moduleRouter };
