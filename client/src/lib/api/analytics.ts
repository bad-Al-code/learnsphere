import { enrollmentService, paymentService } from './client';

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

export interface PerformanceTrend {
  month: string;
  activeStudents: number;
  avgScore: number;
}

export const getPerformanceTrends = async (): Promise<PerformanceTrend[]> => {
  const response = await enrollmentService.get(
    '/api/analytics/instructor/trends'
  );

  if (!response.ok) {
    throw new Error('Failed to fetch performance trends');
  }

  return response.json();
};

export interface GradeDistribution {
  grade: string;
  count: number;
}

export const getGradeDistribution = async (): Promise<GradeDistribution[]> => {
  const response = await enrollmentService.get(
    '/api/analytics/instructor/grade-distribution'
  );
  if (!response.ok) {
    throw new Error('Failed to fetch grade distribution');
  }
  return response.json();
};
