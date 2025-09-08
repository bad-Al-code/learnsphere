import axios from 'axios';

import { PushClient } from '../clients/push.client';
import { env } from '../config/env';
import logger from '../config/logger';
import { NotificationRepository } from '../db/notification.repository';
import { NewNotification, Notification } from '../types';
import { WebSocketService } from './websocket.service';

export class NotificationService {
  private static pushClient = new PushClient();

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

    this.sendPushNotification(notification);

    return notification;
  }

  /**
   * Creates and sends multiple notifications in a single batch operation.
   * @param data - An array of notification objects to be created and dispatched.
   * @returns A promise that resolves to the created notifications.
   */
  public static async createBatchNotifications(
    data: NewNotification[]
  ): Promise<Notification[]> {
    logger.info(`Creating ${data.length} in-app notifications`);

    const notifications = await NotificationRepository.createBatch(data);

    notifications.forEach((notification) => {
      WebSocketService.sendNotification(notification.recipientId, notification);
      this.sendPushNotification(notification);
    });

    return notifications;
  }

  /**
   * Fetches a user's FCM tokens from the user-service and sends them a push notification.
   * @param notification The notification object saved in the database.
   */
  private static async sendPushNotification(
    notification: Notification
  ): Promise<void> {
    try {
      const response = await axios.get<{ fcmTokens: string[] }>(
        `${env.USER_SERVICE_URL}/api/users/${notification.recipientId}/fcm-tokens`
      );

      const tokens = response.data.fcmTokens;
      if (tokens && tokens.length > 0) {
        await this.pushClient.send(
          tokens,
          'New Notification from LearnSphere',
          notification.content,
          notification.linkUrl || undefined
        );
      }
    } catch (error) {
      logger.error(`Failed tp fetch FCM tokens or send push notification`, {
        userId: notification.recipientId,
        error:
          error instanceof axios.AxiosError ? error.message : String(error),
      });
    }
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

  public static async getNotificationsForUser(
    recipientId: string
  ): Promise<Notification[]> {
    logger.info(`Fetching notifications for user ${recipientId}`);

    return await NotificationRepository.findAllByRecipientId(recipientId);
  }

  public static async markAllNotificationsAsRead(recipientId: string) {
    logger.info(`Marking all notifications as read for user ${recipientId}`);

    return await NotificationRepository.markAllAsRead(recipientId);
  }
}
