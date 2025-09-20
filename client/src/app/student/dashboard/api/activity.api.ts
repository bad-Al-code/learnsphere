import { communityService, enrollmentService } from '@/lib/api/server';
import { LiveActivityItem, StudyGroup } from '../schema/activity.schema';

export const getLiveActivityFeed = (): Promise<LiveActivityItem[]> => {
  return enrollmentService.getTyped<LiveActivityItem[]>(
    '/api/analytics/live-activity-feed'
  );
};

export const getStudyGroups = (): Promise<StudyGroup[]> => {
  return communityService.getTyped<StudyGroup[]>('/api/community/study-groups');
};
