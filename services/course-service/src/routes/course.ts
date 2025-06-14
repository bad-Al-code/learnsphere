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

router.get("/", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const allCourses = await CourseService.getAllCourses(page, limit);

  res.status(StatusCodes.OK).json(allCourses);
});

router.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  const course = await CourseService.getCourseById(id);

  res.status(StatusCodes.OK).json(course);
});

router.put(
  "/:id",
  requireAuth,
  validateRequest(createCourseSchema.deepPartial()),
  async (req: Request, res: Response) => {
    const { id: courseId } = req.params;
    const updateData = req.body;
    const userId = req.currentUser!.id;
    const userRole = req.currentUser!.role;

    const updatedData = await CourseService.updateCourse(
      courseId,
      updateData,
      userId,
      userRole
    );

    res.status(StatusCodes.OK).json(updatedData);
  }
);

export { router as courseRouter };
