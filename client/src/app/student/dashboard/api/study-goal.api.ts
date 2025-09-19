import { userService } from '@/lib/api/server';
import { StudyGoal } from '../schema/study-goal.schema';

export const getMyStudyGoals = (): Promise<StudyGoal[]> => {
  return userService.getTyped<StudyGoal[]>('/api/users/me/study-goals');
};
