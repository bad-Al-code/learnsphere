import { Router } from 'express';
import { CategoryController } from '../controllers';
import { requireAuth } from '../middlewares/require-auth';
import { requireRole } from '../middlewares/require-role';
import { validateRequest } from '../middlewares/validate-request';
import { categorySchema } from '../schemas';

const router = Router();
router.use(requireAuth, requireRole(['admin']));

router.post('/', validateRequest(categorySchema), CategoryController.create);
router.get('/', CategoryController.getAll);
router.put('/:id', validateRequest(categorySchema), CategoryController.update);
router.delete('/:id', CategoryController.delete);

export { router as categoryRouter };
