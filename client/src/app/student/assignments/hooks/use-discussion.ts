'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  bookmarkDiscussionAction,
  createDiscussionAction,
  getDiscussionsByCourseAction,
  postReplyAction,
  resolveDiscussionAction,
} from '../actions/draft.action';
import { CreateDiscussionInput, PostReplyInput } from '../schemas/draft.schema';

const discussionQueryKey = (courseId: string) => [
  'assignment-discussions',
  courseId,
];

export const useDiscussions = (courseId: string) =>
  useQuery({
    queryKey: discussionQueryKey(courseId),

    queryFn: async () => {
      const res = await getDiscussionsByCourseAction(courseId);
      if (res.error) throw new Error(res.error);

      return res.data;
    },

    enabled: !!courseId,
  });

export const useCreateDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDiscussionInput) => createDiscussionAction(data),

    onSuccess: (res, vars) => {
      if (res.data) {
        toast.success('Discussion started!');

        queryClient.invalidateQueries({
          queryKey: discussionQueryKey(vars.courseId),
        });
      } else {
        toast.error('Failed to start discussion.', { description: res.error });
      }
    },
  });
};

export const usePostReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      discussionId,
      data,
    }: {
      discussionId: string;
      data: PostReplyInput;
    }) => postReplyAction(discussionId, data),

    onSuccess: (res, vars) => {
      if (res.data) {
        queryClient.invalidateQueries({
          queryKey: ['discussion-replies', vars.discussionId],
        });
      } else {
        toast.error('Failed to post reply.', { description: res.error });
      }
    },
  });
};

export const useBookmarkDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discussionId: string) =>
      bookmarkDiscussionAction(discussionId),

    onSuccess: (res) => {
      if (res.data) {
        toast.success('Bookmark updated!');

        queryClient.invalidateQueries({ queryKey: ['assignment-discussions'] });
      } else {
        toast.error('Failed to update bookmark.', { description: res.error });
      }
    },
  });
};

export const useResolveDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discussionId: string) => resolveDiscussionAction(discussionId),

    onSuccess: (res) => {
      if (res.data) {
        toast.success('Discussion status updated!');

        queryClient.invalidateQueries({ queryKey: ['assignment-discussions'] });
      } else {
        toast.error('Failed to update status.', { description: res.error });
      }
    },
  });
};
