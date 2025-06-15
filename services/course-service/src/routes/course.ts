import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateRequest } from "../middlewares/validate-request";
import {
  createCourseSchema,
  createModuleSchema,
  listCoursesSchema,
} from "../schemas/course-schema";
import { CourseService } from "../services/course-service";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const router = Router();

router.get(
  "/",
  validateRequest(listCoursesSchema),
  async (req: Request, res: Response) => {
    const { limit, page } = req.query as unknown as z.infer<
      typeof listCoursesSchema
    >["query"];

    const result = await CourseService.listCourses(page, limit);

    res.status(StatusCodes.OK).json(result);
  }
);

router.get("/:courseId", async (req: Request, res: Response) => {
  const { courseId } = req.params;

  const course = await CourseService.getCourseDetails(courseId);

  res.status(StatusCodes.OK).json(course);
});

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
  async (req: Request, res: Response) => {
    const { title, description } = req.body;

    const instructorId = req.currentUser!.id;

    const course = await CourseService.createCourse({
      title,
      description,
      instructorId,
    });

    res.status(StatusCodes.CREATED).json(course);
  }
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
  validateRequest(createCourseSchema),
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const updatedData = req.body;
    const requesterId = req.currentUser!.id;

    const course = await CourseService.updateCourse(
      courseId,
      updatedData,
      requesterId
    );

    res.status(StatusCodes.OK).json(course);
  }
);

router.delete(
  "/:courseId",
  requireAuth,
  requireRole(["instructor", "admin"]),
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const requesterId = req.currentUser!.id;

    await CourseService.deleteCourse(courseId, requesterId);

    res.status(StatusCodes.OK).json({ message: "Course deleted successfully" });
  }
);

router.post(
  "/:courseId/publish",
  requireAuth,
  requireRole(["instructor", "admin"]),
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const requesterId = req.currentUser!.id;

    const course = await CourseService.publishCourse(courseId, requesterId);

    res.status(StatusCodes.OK).json(course);
  }
);

router.post(
  "/:courseId/unpublish",
  requireAuth,
  requireRole(["instructor", "admin"]),
  async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const requesterId = req.currentUser!.id;

    const course = await CourseService.unPublishCourse(courseId, requesterId);

    res.status(StatusCodes.OK).json(course);
  }
);

export { router as courseRouter };
