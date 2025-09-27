'use client';

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { getStudyRoomsAction } from '../action/study-room.action';
import {
  createStudyRoom,
  deleteStudyRoom,
  generateShareLink,
  getCategories,
  joinStudyRoom,
  scheduleReminder,
  updateStudyRoom,
} from '../api/study-room.api.client';
import { GenerateShareLinkInput } from '../schema';
import { StudyRoom, UpdateStudyRoomInput } from '../schema/study-rooms.schema';

export const useStudyRooms = (query?: string, topic?: string) => {
  return useInfiniteQuery({
    queryKey: ['study-rooms', query, topic],

    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      const result = await getStudyRoomsAction({
        query,
        topic,
        cursor: pageParam,
      });

      if (result.error) throw new Error(result.error);

      return result.data;
    },

    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
  });
};

export const useCreateStudyRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudyRoom,
    onSuccess: (newRoom) => {
      toast.success('Study Room Created!');

      queryClient.setQueryData(
        ['study-rooms'],
        (oldData: StudyRoom[] | undefined) => {
          return oldData ? [newRoom, ...oldData] : [newRoom];
        }
      );

      queryClient.invalidateQueries({ queryKey: ['study-rooms'] });
    },
    onError: (error) => {
      toast.error('Failed to create room', { description: error.message });
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60,
  });
};

export const useJoinStudyRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: joinStudyRoom,
    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ['study-rooms'] });
    },

    onError: (error) => {
      toast.error('Failed to join room', { description: error.message });
    },
  });
};

export const useUpdateStudyRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      roomId,
      data,
    }: {
      roomId: string;
      data: UpdateStudyRoomInput;
    }) => updateStudyRoom(roomId, data),

    onSuccess: () => {
      toast.success('Study Room updated!');
      queryClient.invalidateQueries({ queryKey: ['study-rooms'] });
    },

    onError: (error) =>
      toast.error('Failed to update room', { description: error.message }),
  });
};

export const useDeleteStudyRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStudyRoom,

    onSuccess: () => {
      toast.success('Study Room deleted.');
      queryClient.invalidateQueries({ queryKey: ['study-rooms'] });
    },

    onError: (error) =>
      toast.error('Failed to delete room', { description: error.message }),
  });
};

export const useScheduleReminder = () => {
  return useMutation({
    mutationFn: scheduleReminder,

    onSuccess: (data) => {
      toast.success(data.message);
    },

    onError: (error) => {
      toast.error('Failed to schedule reminder', {
        description: error.message,
      });
    },
  });
};

export const useGenerateShareLink = () => {
  return useMutation({
    mutationFn: (data: GenerateShareLinkInput) => generateShareLink(data),

    onError: (error) => {
      toast.error('Failed to create share link', {
        description: error.message,
      });
    },
  });
};
