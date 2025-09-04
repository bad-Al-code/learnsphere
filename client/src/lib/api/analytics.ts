import { enrollmentService, paymentService } from '../api';

export interface OverallStats {
  avgCompletion: string;
  avgGrade: number | null;
}

export interface EngagementScore {
  score: number;
  change: number;
}

export interface RevenueBreakdownItem {
  name: string;
  value: number;
}

export const getOverallStats = async (): Promise<OverallStats> => {
  const response = await enrollmentService.get(
    '/api/analytics/instructor/overall-stats'
  );

  if (!response.ok) {
    throw new Error('Failed to fetch overall stats');
  }

  return response.json();
};

export const getEngagementScore = async (): Promise<EngagementScore> => {
  const response = await enrollmentService.get(
    '/api/analytics/instructor/engagement-score'
  );

  if (!response.ok) {
    throw new Error('Failed to fetch engagement score');
  }

  return response.json();
};

export const getTotalRevenue = async (): Promise<{ totalRevenue: number }> => {
  const response = await paymentService.get(
    '/api/payments/analytics/instructor/revenue-breakdown'
  );

  if (!response.ok) {
    throw new Error('Failed to fetch revenue data');
  }

  const breakdown: RevenueBreakdownItem[] = await response.json();
  const totalRevenue = breakdown.reduce((sum, item) => sum + item.value, 0);

  return { totalRevenue };
};
