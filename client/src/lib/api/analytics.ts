import { enrollmentService, paymentService } from './client';

export interface OverallStats {
  avgCompletion: string;
  avgGrade: number | null;
  completionChange: number;
  gradeChange: number;
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

export interface RevenueStats {
  totalRevenue: number;
  change: number;
}

export const getRevenueStats = async (): Promise<RevenueStats> => {
  const response = await paymentService.get(
    '/api/payments/analytics/instructor/revenue-stats'
  );

  if (!response.ok) {
    throw new Error('Failed to fetch revenue stats');
  }

  return response.json();
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

export interface StudentPerformance {
  userId: string;
  courseId: string;
  progressPercentage: string;
  lastActive: string;
  averageGrade: string | null;
}

export interface StudentPerformanceOverview {
  topPerformers: StudentPerformance[];
  studentsAtRisk: StudentPerformance[];
}

export const getStudentPerformanceOverview =
  async (): Promise<StudentPerformanceOverview> => {
    const response = await enrollmentService.get(
      '/api/analytics/instructor/student-performance-overview'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch student performance');
    }

    const data = await response.json();
    return data;
  };

export interface EngagementDistribution {
  activity: string;
  students: number;
}

export const getEngagementDistribution = async (): Promise<
  EngagementDistribution[]
> => {
  const response = await enrollmentService.get(
    '/api/analytics/instructor/engagement-distribution'
  );

  if (!response.ok) {
    throw new Error('Failed to fetch engagement distribution');
  }

  const data = await response.json();
  console.log(data);

  return data;
};
