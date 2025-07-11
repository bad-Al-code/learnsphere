import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { requireAuth } from '../middlewares/require-auth';

const router = Router();

router.use(requireAuth);

/**
 * @route GET /api/notifications
 * @description Fetches all notifications for the current user.
 */
router.get('/', NotificationController.getMyNotifications);

/**
 * @route POST /api/notifications/:notificationId/read
 * @description Marks a specific notification as read.
 */
router.post('/:notificationId/read', NotificationController.markAsRead);

export { router as notificationRouter };
