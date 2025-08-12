import { Router } from 'express';
import { z } from 'zod';
import { ResourceController } from '../controllers';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import { createResourceSchema, updateResourceSchema } from '../schemas';

const router = Router();
router.use(requireAuth, requireRole(['instructor', 'admin']));

router.get('/courses/:courseId/resources', ResourceController.getForCourse);
router.post(
  '/courses/:courseId/resources',
  validateRequest(z.object({ body: createResourceSchema })),
  ResourceController.create
);

router.put(
  '/resources/:resourceId',
  validateRequest(z.object({ body: updateResourceSchema })),
  ResourceController.update
);
router.delete('/resources/:resourceId', ResourceController.delete);

export { router as resourceRouter };
