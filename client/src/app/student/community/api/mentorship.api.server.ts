import { communityService } from '@/lib/api/server';
import { MentorshipPaginatedResponse } from '../schema';

export const getMentorshipPrograms = (params: {
  query?: string;
  status?: string;
  isFree?: boolean;
  isFavorite?: boolean;
  limit?: number;
  cursor?: string;
}): Promise<MentorshipPaginatedResponse> => {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.set('q', params.query);
  if (params.status && params.status !== 'all')
    searchParams.set('status', params.status);
  if (params.isFree) searchParams.set('isFree', 'true');
  if (params.isFavorite) searchParams.set('isFavorite', 'true');
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.cursor) searchParams.set('cursor', params.cursor);

  return communityService.getTyped(
    `/api/community/mentorships?${searchParams.toString()}`
  );
};
