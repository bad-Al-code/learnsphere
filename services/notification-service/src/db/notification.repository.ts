import { and, desc, eq } from 'drizzle-orm';

import { db } from '.';
import { NewNotification, Notification } from '../types';
import { notifications } from './schema';

export class NotificationRepository {
  /**
   * Creates a new notification record.
   * @param data The data for the new notification.
   * @returns The newly created notification.
   */
  public static async create(data: NewNotification): Promise<Notification> {
    const [newNotification] = await db
      .insert(notifications)
      .values(data)
      .returning();

    return newNotification;
  }

  /**
   * Finds all notifications for a specific user, with pagination.
   * @param recipientId The ID of the user.
   * @param limit The number of notifications to fetch.
   * @param offset The number of notifications to skip.
   * @returns An array of notification objects.
   */
  public static async findByRecipientId(
    recepientId: string,
    limit: number,
    offset: number
  ): Promise<Notification[]> {
    return db.query.notifications.findMany({
      where: eq(notifications.recipientId, recepientId),
      orderBy: [desc(notifications.createdAt)],
      limit,
      offset,
    });
  }

  /**
   * Marks a specific notification as read.
   * @param notificationId The ID of the notification to update.
   * @param recipientId The ID of the user who owns the notification, for security.
   * @returns The updated notification or null if not found/not owned by the user.
   */
  public static async markAsRead(
    notificationId: string,
    recepientId: string
  ): Promise<Notification | null> {
    const [updatedNotification] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.recipientId, recepientId)
        )
      )
      .returning();

    return updatedNotification || null;
  }
}
