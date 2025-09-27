import { communityService } from '@/lib/api/server';
import { CommunityInsights } from '../schema';

export const getCommunityInsights = (): Promise<CommunityInsights> => {
  return communityService.getTyped<CommunityInsights>(
    '/api/community/insights'
  );
};
