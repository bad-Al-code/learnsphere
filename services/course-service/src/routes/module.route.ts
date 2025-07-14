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
import { ModuleController } from "../controllers/module.controller";
import { LessonController } from "../controllers/lesson.controller";

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
  LessonController.create
);

router.put(
  "/:moduleId",
  requireAuth,
  requireRole(["instructor", "admin"]),
  validateRequest(createModuleSchema),
  ModuleController.update
);

router.delete(
  "/:moduleId",
  requireAuth,
  requireRole(["instructor", "admin"]),
  ModuleController.delete
);

router.post(
  "/reorder",
  requireAuth,
  requireRole(["instructor", "admin"]),
  ModuleController.reorder
);

export { router as moduleRouter };
