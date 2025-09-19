import { enrollmentService } from '@/lib/api/server';
import { AverageGradeResponse } from '../schema/stats.schema';

export const getMyAverageGrade = (): Promise<AverageGradeResponse> => {
  return enrollmentService.getTyped<AverageGradeResponse>(
    '/api/analytics/my-average-grade'
  );
};
