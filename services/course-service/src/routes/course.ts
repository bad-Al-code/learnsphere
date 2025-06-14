import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateRequest } from "../middlewares/validate-request";
import {
  createCourseSchema,
  createModuleSchema,
} from "../schemas/course-schema";
import { CourseService } from "../services/course-service";
import { StatusCodes } from "http-status-codes";

const router = Router();

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
