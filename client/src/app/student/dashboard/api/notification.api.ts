import { notificationService } from '@/lib/api/client';
import { Notification } from '../schema/notification.schema';

export const getMyNotifications = async (): Promise<Notification[]> => {
  const response =
    await notificationService.get<Notification[]>('/api/notifications');

  return response.data;
};

export const markNotificationAsRead = async (
  notificationId: string
): Promise<Notification> => {
  const response = await notificationService.post<Notification>(
    `/api/notifications/${notificationId}/read`,
    {}
  );

  return response.data;
};

export const markAllAsRead = async (): Promise<{ message: string }> => {
  const response = await notificationService.post<{ message: string }>(
    '/api/notifications/mark-all-read',
    {}
  );

  return response.data;
};
