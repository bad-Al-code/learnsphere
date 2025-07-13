import axios from 'axios';

import { PushClient } from '../clients/push.client';
import logger from '../config/logger';
import { NotificationRepository } from '../db/notification.repository';
import { NewNotification, Notification } from '../types';
import { WebSocketService } from './websocket.service';
import { env } from '../config/env';

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
}
