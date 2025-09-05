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
  const response = await notificationService.get('/api/notifications');

  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }

  return response.json();
};

export const markAllNotificationsAsRead = async (): Promise<{
  message: string;
}> => {
  const response = await notificationService.post(
    '/api/notifications/mark-all-read',
    {}
  );

  if (!response.ok) {
    throw new Error('Failed to mark notifications as read');
  }

  return response.json();
};
