import { communityService } from '@/lib/api/client';
import { DiscussionMutationResponse } from '../schema';

export const upvoteDiscussion = (discussionId: string) =>
  communityService.postTyped<DiscussionMutationResponse>(
    `/api/community/discussions/${discussionId}/upvote`,
    {}
  );

export const downvoteDiscussion = (discussionId: string) =>
  communityService.postTyped<DiscussionMutationResponse>(
    `/api/community/discussions/${discussionId}/downvote`,
    {}
  );

export const reactToDiscussion = (messageId: string, reaction: string) =>
  communityService.postTyped<DiscussionMutationResponse>(
    `/api/community/messages/${messageId}/react`,
    {
      reaction,
    }
  );
