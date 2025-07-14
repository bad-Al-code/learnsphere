import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateRequest } from "../middlewares/validate-request";
import {
  createCourseSchema,
  createModuleSchema,
  listCoursesSchema,
  bulkCoursesSchema,
} from "../schemas/course-schema";
import { CourseService } from "../controllers/course-service";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { CourseController } from "../controllers/course.controller";
import { ModuleController } from "../controllers/module.controller";

const router = Router();

router.get("/", validateRequest(listCoursesSchema), CourseController.list);

router.get("/:courseId", CourseController.getById);

router.get("/:courseId/modules", CourseController.getCourseModules);

router.post(
  "/",
  requireAuth,
  requireRole(["admin", "instructor"]),
  validateRequest(createCourseSchema),
  CourseController.create
);

router.post(
  "/:courseId/modules",
  requireAuth,
  requireRole(["admin", "instructor"]),
  validateRequest(createModuleSchema),
  ModuleController.create
);

router.put(
  "/:courseId",
  requireAuth,
  requireRole(["instructor", "admin"]),
  validateRequest(createCourseSchema.partial()),
  CourseController.update
);

router.delete(
  "/:courseId",
  requireAuth,
  requireRole(["instructor", "admin"]),
  CourseController.delete
);

router.post(
  "/:courseId/publish",
  requireAuth,
  requireRole(["instructor", "admin"]),
  CourseController.publish
);

router.post(
  "/:courseId/unpublish",
  requireAuth,
  requireRole(["instructor", "admin"]),
  CourseController.unpublish
);

router.post(
  "/bulk",
  validateRequest(bulkCoursesSchema),
  CourseController.getBulk
);

export { router as courseRouter };
