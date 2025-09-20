import { enrollmentService } from '@/lib/api/server';
import { MyCourse } from '../schema/enrollment.schema';
import { AIInsight, StudyTimeDataPoint } from '../schema/insights.schema';

export const getMyEnrolledCourses = (): Promise<MyCourse[]> => {
  return enrollmentService.getTyped<MyCourse[]>('/api/enrollments/my-courses');
};

export const getMyStudyTrend = (): Promise<StudyTimeDataPoint[]> => {
  return enrollmentService.getTyped<StudyTimeDataPoint[]>(
    '/api/analytics/my-study-trend'
  );
};

export const getMyAIInsights = (): Promise<AIInsight[]> => {
  return enrollmentService.getTyped<AIInsight[]>('/api/analytics/my-insights');
};
