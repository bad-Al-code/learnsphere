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

const router = Router();

router.get("/", validateRequest(listCoursesSchema), CourseController.list);

router.get("/:courseId", CourseController.getById);

router.get("/:courseId/modules", async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const courseModules = await CourseService.getModuleForCourse(courseId);

  res.status(StatusCodes.OK).json(courseModules);
});

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
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const { title } = req.body;
    const requesterId = req.currentUser!.id;

    const module = await CourseService.addModuleToCourse(
      { title, courseId },
      requesterId
    );

    res.status(StatusCodes.CREATED).json(module);
  }
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
  async (req: Request, res: Response) => {
    const { courseIds } = req.body;
    const courses = await CourseService.getCourseByIds(courseIds);

    res.status(StatusCodes.OK).json(courses);
  }
);

export { router as courseRouter };
