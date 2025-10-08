import { communityService as clientCommunityService } from '@/lib/api/client';
import { BecomeMentorInput, MentorshipStatusResponse } from '../schema';

export const applyToBeMentor = async (
  data: BecomeMentorInput
): Promise<{ message: string }> => {
  const response = await clientCommunityService.post<{ message: string }>(
    '/api/community/mentorships/apply',
    data
  );

  return response.data;
};

export const getMentorshipStatus =
  async (): Promise<MentorshipStatusResponse> => {
    const response = await clientCommunityService.get<{
      success: boolean;
      data: MentorshipStatusResponse;
    }>('/api/community/mentorships/status');

    return response.data.data;
  };
