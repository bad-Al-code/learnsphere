'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getStudyRoomsAction } from '../action/study-room.action';
import {
  createStudyRoom,
  getCategories,
  joinStudyRoom,
} from '../api/study-room.api.client';
import { StudyRoom } from '../schema/study-rooms.schema';

export const useStudyRooms = (query?: string, topic?: string) => {
  return useQuery({
    queryKey: ['study-rooms', query, topic],

    queryFn: async () => {
      const result = await getStudyRoomsAction({ query, topic });
      console.log(result);
      if (result.error) throw new Error(result.error);

      return result.data;
    },
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
