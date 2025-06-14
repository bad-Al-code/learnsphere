import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares/require-auth";
import { requireRole } from "../middlewares/require-role";
import { validateRequest } from "../middlewares/validate-request";
import { createCourseSchema } from "../schemas/course-schema";
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

export { router as courseRouter };
