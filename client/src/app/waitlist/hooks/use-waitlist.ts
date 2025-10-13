'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  getWaitlistStats,
  getWaitlistStatus,
  joinWaitlist,
  updateInterests,
  WaitlistApiError,
} from '../api/waitlist.api.client';
import {
  JoinWaitlistInput,
  JoinWaitlistResponse,
} from '../schema/waitlist.schema';

export const WAITLIST_QUERY_KEY = ['waitlist'] as const;

/**
 * @description TanStack Query mutation hook for joining the waitlist.
 * Handles loading, error, and success states with proper UX feedback.
 * @returns A mutation object from TanStack Query with enhanced features.
 */
export const useJoinWaitlist = () => {
  const queryClient = useQueryClient();

  return useMutation<JoinWaitlistResponse, WaitlistApiError, JoinWaitlistInput>(
    {
      mutationKey: [...WAITLIST_QUERY_KEY, 'join'],
      mutationFn: joinWaitlist,

      onMutate: async (variables) => {
        toast.loading('Adding you to the waitlist...', {
          id: 'waitlist-loading',
        });
      },

      onSuccess: (data, variables) => {
        toast.dismiss('waitlist-loading');

        toast.success('Welcome to the waitlist!', {
          description: `We'll notify you at ${data.data.email} when we launch.`,
          duration: 5000,
        });

        queryClient.invalidateQueries({ queryKey: WAITLIST_QUERY_KEY });
      },

      onError: (error) => {
        toast.dismiss('waitlist-loading');

        const errorMessage = error.message || 'Failed to join waitlist';

        if (error.statusCode === 409) {
          toast.info('Already on the list!', {
            description:
              "You're already registered. We'll notify you at launch!",
            duration: 5000,
          });
        } else {
          toast.error('Could not join waitlist', {
            description: errorMessage,
            duration: 5000,
          });
        }
      },

      retry: (failureCount, error) => {
        if (
          error.statusCode &&
          error.statusCode >= 400 &&
          error.statusCode < 500
        ) {
          return false;
        }

        return failureCount < 2;
      },

      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }
  );
};

export const useWaitlistStatus = (email: string) => {
  return useQuery({
    queryKey: [...WAITLIST_QUERY_KEY, 'status', email],
    queryFn: async () => {
      const result = await getWaitlistStatus(email);

      return result.data;
    },
    enabled: !!email,
    staleTime: Infinity,
    retry: 1,
  });
};

/**
 * @description TanStack Query hook for fetching waitlist statistics.
 * @returns A query object with waitlist stats.
 */
export const useWaitlistStats = () => {
  return useQuery({
    queryKey: [...WAITLIST_QUERY_KEY, 'stats'],
    queryFn: getWaitlistStats,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000,
  });
};

export const useUpdateInterests = () => {
  return useMutation({
    mutationFn: async (data: { email: string; interests: string[] }) => {
      const result = await updateInterests(data);

      return result;
    },

    onSuccess: () => {
      toast.success('Your interests have been saved!');
    },

    onError: (error: Error) => {
      toast.error('Could not save interests', {
        description: error.message,
      });
    },
  });
};
