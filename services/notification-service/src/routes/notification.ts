import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request.middleware';
import { bulkInviteSchema, emailInviteSchema } from '../schemas/email.schema';

const router = Router();

router.use(requireAuth);

/**
 * @route GET /api/notifications
 * @description Fetches all notifications for the current user.
 */
router.get('/', NotificationController.getMyNotifications);

/**
 * @route POST /api/notifications/mark-all-read
 * @description Marks all of the user's notifications as read.
 */
router.post('/mark-all-read', NotificationController.markAllAsRead);

/**
 * @route POST /api/notifications/:notificationId/read
 * @description Marks a specific notification as read.
 */
router.post('/:notificationId/read', NotificationController.markAsRead);

router.post(
  '/email-invite',
  validateRequest(emailInviteSchema),
  NotificationController.sendEmailInvites
);

router.post(
  '/bulk-invite',
  requireAuth,
  validateRequest(bulkInviteSchema),
  NotificationController.sendBulkEmailInvites
);

export { router as notificationRouter };
