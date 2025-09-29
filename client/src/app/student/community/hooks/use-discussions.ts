'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getDiscussionsAction } from '../action';
import {
  downvoteDiscussion,
  reactToDiscussion,
  upvoteDiscussion,
} from '../api/discussion.api.client';
import { Discussion, ReactionEmoji } from '../schema';

export const useDiscussions = (courseId: string) => {
  return useQuery({
    queryKey: ['discussions', courseId],
    queryFn: async () => {
      const result = await getDiscussionsAction(courseId);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: !!courseId,
    staleTime: 30000,
    retry: 2,
  });
};

export const useUpvoteDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => upvoteDiscussion(messageId),

    onMutate: async (messageId) => {
      await queryClient.cancelQueries({ queryKey: ['discussions'] });

      const previousData = queryClient.getQueriesData<Discussion[]>({
        queryKey: ['discussions'],
      });

      queryClient.setQueriesData<Discussion[]>(
        { queryKey: ['discussions'] },
        (old) => {
          if (!old) return old;
          return old.map((discussion) => {
            if (discussion.id === messageId) {
              const wasUpvoted = discussion.upvotes > 0;
              return {
                ...discussion,
                upvotes: discussion.upvotes + 1,
                downvotes: Math.max(0, discussion.downvotes),
              };
            }
            return discussion;
          });
        }
      );

      return { previousData };
    },

    onError: (error, messageId, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to upvote', {
        description: error.message || 'Please try again',
      });
    },

    onSuccess: (data, messageId) => {
      if (data?.status === 'added') {
        toast.success('Upvoted successfully');
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
    },
  });
};

export const useDownvoteDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => downvoteDiscussion(messageId),

    onMutate: async (messageId) => {
      await queryClient.cancelQueries({ queryKey: ['discussions'] });

      const previousData = queryClient.getQueriesData<Discussion[]>({
        queryKey: ['discussions'],
      });

      queryClient.setQueriesData<Discussion[]>(
        { queryKey: ['discussions'] },
        (old) => {
          if (!old) return old;
          return old.map((discussion) => {
            if (discussion.id === messageId) {
              return {
                ...discussion,
                downvotes: discussion.downvotes + 1,
                upvotes: Math.max(0, discussion.upvotes),
              };
            }
            return discussion;
          });
        }
      );

      return { previousData };
    },

    onError: (error, messageId, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to downvote', {
        description: error.message || 'Please try again',
      });
    },

    onSuccess: (data) => {
      if (data?.status === 'added') {
        toast.success('Downvoted successfully');
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
    },
  });
};

export const useReactToDiscussion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageId,
      reaction,
    }: {
      messageId: string;
      reaction: string;
    }) => reactToDiscussion(messageId, reaction),

    onMutate: async ({ messageId, reaction }) => {
      await queryClient.cancelQueries({ queryKey: ['discussions'] });

      const previousData = queryClient.getQueriesData<Discussion[]>({
        queryKey: ['discussions'],
      });

      queryClient.setQueriesData<Discussion[]>(
        { queryKey: ['discussions'] },
        (old) => {
          if (!old) return old;
          return old.map((discussion) => {
            if (discussion.id === messageId) {
              const updatedReactions = [...discussion.reactions];
              const reactionIndex = updatedReactions.findIndex(
                (r) => r.emoji.toLowerCase() === reaction.toLowerCase()
              );
              const emoji: ReactionEmoji = (reaction.charAt(0).toUpperCase() +
                reaction.slice(1)) as ReactionEmoji;

              if (reactionIndex !== -1) {
                updatedReactions[reactionIndex] = {
                  ...updatedReactions[reactionIndex],
                  count: updatedReactions[reactionIndex].count + 1,
                };
              } else {
                const reactionColors: Record<string, string> = {
                  star: 'text-yellow-500',
                  heart: 'text-red-500',
                  sparkles: 'text-purple-500',
                };

                updatedReactions.push({
                  emoji,
                  count: 1,
                  color: reactionColors[reaction] || 'text-primary',
                });
              }

              return {
                ...discussion,
                reactions: updatedReactions,
              };
            }
            return discussion;
          });
        }
      );

      return { previousData };
    },

    onError: (error, { messageId, reaction }, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to add reaction', {
        description: error.message || 'Please try again',
      });
    },

    onSuccess: (data, { reaction }) => {
      if (data?.status === 'added') {
        toast.success(`Reacted with ${reaction}`);
      } else if (data?.status === 'updated') {
        toast.success(`Reaction updated to ${reaction}`);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
    },
  });
};

export const usePrefetchDiscussions = () => {
  const queryClient = useQueryClient();

  return (courseId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['discussions', courseId],
      queryFn: async () => {
        const result = await getDiscussionsAction(courseId);
        if (result.error) throw new Error(result.error);
        return result.data;
      },
      staleTime: 30000,
    });
  };
};

export const useDiscussionFromCache = (
  courseId: string,
  discussionId: string
) => {
  const queryClient = useQueryClient();
  const discussions = queryClient.getQueryData<Discussion[]>([
    'discussions',
    courseId,
  ]);

  return discussions?.find((d) => d.id === discussionId);
};
