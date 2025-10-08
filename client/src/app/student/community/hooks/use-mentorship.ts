'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { getMentorshipProgramsAction } from '../action';
import {
  applyToBeMentor,
  getMentorshipStatus,
} from '../api/mentorship.api.client';
import { BecomeMentorInput } from '../schema';

export const useMentorships = (filters: {
  query?: string;
  status?: string;
  isFree?: boolean;
  isFavorite?: boolean;
}) => {
  const { query, status, isFree, isFavorite } = filters;

  return useInfiniteQuery({
    queryKey: ['mentorships', query, status, isFree, isFavorite],

    queryFn: async ({ pageParam }) => {
      const result = await getMentorshipProgramsAction({
        ...filters,
        cursor: pageParam,
      });
      if (result.error) throw new Error(result.error);

      console.log(result.data);
      return result.data;
    },

    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
};

export const useMentorStatus = () => {
  return useQuery({
    queryKey: ['mentorship-status'],
    queryFn: getMentorshipStatus,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });
};

interface ErrorResponse {
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}
interface SuccessResponse {
  message?: string;
}

export const useBecomeMentor = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SuccessResponse,
    AxiosError<ErrorResponse>,
    BecomeMentorInput
  >({
    mutationFn: applyToBeMentor,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['mentorship-status'] });

      toast.success('Application Submitted Successfully!', {
        description:
          data.message ||
          "Your application is under review. We'll notify you soon.",
        duration: 5000,
      });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      let title = 'Submission Failed';
      let description = 'Something went wrong. Please try again.';

      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        switch (status) {
          case 400:
            title = 'Invalid Application';
            description =
              errorData?.message || 'Please check your input and try again.';
            break;
          case 401:
            title = 'Authentication Required';
            description = 'Please log in to submit an application.';
            break;
          case 409:
            title = 'Application Already Exists';
            description =
              errorData?.message || 'You already have an application on file.';
            break;
          case 429:
            title = 'Too Many Requests';
            description = 'Please wait a few minutes before trying again.';
            break;
          case 500:
            title = 'Server Error';
            description =
              'Our servers are experiencing issues. Please try again later.';
            break;
          default:
            description = errorData?.message || error.message || description;
        }
      } else if (error.request) {
        title = 'Network Error';
        description = 'Please check your internet connection and try again.';
      }

      toast.error(title, {
        description,
        duration: 5000,
      });
    },
    retry: (failureCount, error: AxiosError) => {
      if (error.response) {
        const status = error.response.status;
        if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
          return false;
        }
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
