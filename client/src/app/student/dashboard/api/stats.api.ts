import { courseService, enrollmentService } from '@/lib/api/server';
import {
  AverageGradeResponse,
  DueSoonResponse,
  StudyStreakResponse,
} from '../schema/stats.schema';

export const getMyAverageGrade = (): Promise<AverageGradeResponse> => {
  return enrollmentService.getTyped<AverageGradeResponse>(
    '/api/analytics/my-average-grade'
  );
};

export const getDueSoonCount = (): Promise<DueSoonResponse> => {
  return courseService.getTyped<DueSoonResponse>(
    '/api/assignments/due-soon-count'
  );
};

export const getMyStudyStreak = (): Promise<StudyStreakResponse> => {
  return enrollmentService.getTyped<StudyStreakResponse>(
    '/api/analytics/my-study-streak'
  );
};
