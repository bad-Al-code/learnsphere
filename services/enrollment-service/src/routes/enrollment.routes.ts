import { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";

import { requireAuth } from "../middlewares/require-auth";
import { validateRequest } from "../middlewares/validate-request";
import { createEnrollmentSchema } from "../schema/enrollment.schema";
import { EnrollmentService } from "../services/enrollment.service";

const router = Router();

router.post(
  "/",
  requireAuth,
  validateRequest(createEnrollmentSchema),
  async (req: Request, res: Response) => {
    const { courseId } = req.body;
    const userId = req.currentUser!.id;
    const userEmail = req.currentUser!.email;

    const enrollment = await EnrollmentService.createEnrollment({
      courseId,
      userId,
      userEmail,
    });

    res.status(StatusCodes.CREATED).json(enrollment);
  }
);

export { router as enrollmentRouter };
