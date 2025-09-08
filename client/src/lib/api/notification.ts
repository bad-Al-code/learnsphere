import { notificationService } from './client';

export interface Notification {
  id: string;
  recipientId: string;
  type: string;
  content: string;
  isRead: boolean;
  linkUrl: string | null;
  createdAt: string;
}

export const getNotifications = async (): Promise<Notification[]> => {
  const response =
    await notificationService.get<Notification[]>('/api/notifications');

  return response.data;
};

export const markAllNotificationsAsRead = async (): Promise<{
  message: string;
}> => {
  const response = await notificationService.post<{ message: string }>(
    '/api/notifications/mark-all-read',
    {}
  );

  return response.data;
};
