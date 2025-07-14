import { Request, Response, Router } from 'express';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import { CourseService } from '../controllers/course-service';
import { StatusCodes } from 'http-status-codes';
import {
  videoUploadUrlSchema,
  createLessonSchema,
  reorderSchema,
} from '../schemas';
import { LessonController } from '../controllers/lesson.controller';

const router = Router();

router.get('/:lessonId', LessonController.getById);

router.put(
  '/:lessonId',
  requireAuth,
  requireRole(['instructor', 'admin']),
  validateRequest(createLessonSchema.partial()),
  LessonController.update
);

router.delete(
  '/:lessonId',
  requireAuth,
  requireRole(['instructor', 'admin']),
  LessonController.delete
);

router.post(
  '/reorder',
  requireAuth,
  requireRole(['instructor', 'admin']),
  validateRequest(reorderSchema),
  LessonController.reorder
);

router.post(
  '/:lessonId/request-video-upload',
  requireAuth,
  requireRole(['instructor', 'admin']),
  validateRequest(videoUploadUrlSchema),
  async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const { filename } = req.body;
    const requesterId = req.currentUser!.id;

    const uploadData = await CourseService.requestVideoUploadUrl(
      lessonId,
      filename,
      requesterId
    );

    res.status(StatusCodes.OK).json(uploadData);
  }
);

export { router as lessonRouter };
