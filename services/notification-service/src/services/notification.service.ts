import logger from '../config/logger';
import { NotificationRepository } from '../db/notification.repository';
import { NewNotification, Notification } from '../types';
import { WebSocketService } from './websocket.service';

export class NotificationService {
  /**
   * Creates a new in-app notification.
   * @param data The data for the notification
   * @returns  The created notification object,
   */
  public static async createNotification(
    data: NewNotification
  ): Promise<Notification> {
    logger.info(`Creating in-app notification`, {
      type: data.type,
      recipientId: data.recipientId,
    });

    const notification = await NotificationRepository.create(data);

    WebSocketService.sendNotification(notification.recipientId, notification);

    return notification;
  }

  /**
   * Fetches a paginated list of notification for a user.
   * @param recipientId The ID of the user
   * @param page The page number
   * @param limit The number of result per page
   * @returns An array of notification.
   */
  public static async getNotification(
    recipientId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<Notification[]> {
    const offset = (page - 1) * limit;

    return await NotificationRepository.findByRecipientId(
      recipientId,
      limit,
      offset
    );
  }

  /**
   * Marks a user's notification as read.
   * @param notificationId The ID of the notification
   * @param recipientId The ID of the user trying to mark it as read.
   * @returns The updated notification
   * @throws An error if the notification is not ffound or doesn't belong to the user.
   */
  public static async markNotificationAsRead(
    notificationId: string,
    recipientId: string
  ): Promise<Notification> {
    const notification = await NotificationRepository.markAsRead(
      notificationId,
      recipientId
    );

    if (!notification) {
      throw new Error(`Notification not found or access denied.`);
    }

    return notification;
  }
}
