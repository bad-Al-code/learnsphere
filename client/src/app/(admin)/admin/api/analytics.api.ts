import { userService } from '@/lib/api/server';
import { WaitlistAnalyticsData } from '../schema';

export const getWaitlistAnalytics =
  async (): Promise<WaitlistAnalyticsData> => {
    try {
      const response = await userService.getTyped<{
        data: WaitlistAnalyticsData;
      }>('/api/users/analytics/waitlist');

      return response.data;
    } catch (error) {
      console.error('Failed to fetch waitlist analytics:', error);

      throw new Error('Could not load waitlist analytics data.');
    }
  };
