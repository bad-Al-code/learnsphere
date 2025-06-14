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

export { router as courseRouter };
