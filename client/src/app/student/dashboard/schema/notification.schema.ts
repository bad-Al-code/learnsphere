import { z } from 'zod';

export const notificationCategorySchema = z.enum([
  'assignments',
  'courses',
  'platform',
  'message',
  'SECURITY_ALERT',
  'WELCOME',
  'APPLICATION_STATUS',
]);
export type NotificationCategory = z.infer<typeof notificationCategorySchema>;

export const notificationSchema = z.object({
  id: z.uuid(),
  recipientId: z.uuid(),
  type: z.string(),
  content: z.string(),
  isRead: z.boolean(),
  linkUrl: z.string().nullable(),
  createdAt: z.iso.datetime(),
});

export const notificationsResponseSchema = z.array(notificationSchema);
export type Notification = z.infer<typeof notificationSchema>;
