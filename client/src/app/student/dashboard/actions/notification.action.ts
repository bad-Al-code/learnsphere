'use server';

import { notificationService } from '@/lib/api/server';

export const getMyNotificationsAction = async () => {
  try {
    const response = await notificationService.get('/api/notifications');
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    return { data: await response.json() };
  } catch (error) {
    return { error: 'Could not retrieve notifications.' };
  }
};
