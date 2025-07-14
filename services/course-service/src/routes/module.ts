import e, { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateRequest } from "../middlewares/validate-request";
import {
  createLessonSchema,
  createModuleSchema,
} from "../schemas/course-schema";
import { CourseService } from "../controllers/course-service";

const router = Router();

router.get("/:moduleId", async (req: Request, res: Response) => {
  const { moduleId } = req.params;
  const moduleDetails = await CourseService.getModuleDetails(moduleId);

  res.status(StatusCodes.OK).json(moduleDetails);
});

router.post(
  "/:moduleId/lessons",
  requireAuth,
  requireRole(["admin", "instructor"]),
  validateRequest(createLessonSchema),
  async (req: Request, res: Response) => {
    const { moduleId } = req.params;
    const lessonData = req.body;
    const requesterId = req.currentUser!.id;

    const lesson = await CourseService.addLessonToModule(
      { ...lessonData, moduleId },
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

router.post(
  "/reorder",
  requireAuth,
  requireRole(["instructor", "admin"]),
  async (req: Request, res: Response) => {
    const { ids } = req.body;
    const requesterId = req.currentUser!.id;

    await CourseService.reorderModules(ids, requesterId);

    res
      .status(StatusCodes.OK)
      .json({ message: "Modules reorderd successfully" });
  }
);

export { router as moduleRouter };
