import { Router, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validateRequest } from "../middlewares/validate-request";
import { bulkCoursesSchema } from "../schemas";
import { CourseService } from "../services/course-service";

const router = Router();

router.post(
  "/bulk",
  validateRequest(bulkCoursesSchema),
  async (req: Request, res: Response) => {
    const { courseIds } = req.body;
    const courses = await CourseService.getCourseByIds(courseIds);

    res.status(StatusCodes.OK).json(courses);
  }
);

export { router as internalRouter };
