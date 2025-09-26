'use client';

import { useQuery } from '@tanstack/react-query';
import { getStudyRoomsAction } from '../action/study-room.action';

export const useStudyRooms = (query?: string, topic?: string) => {
  return useQuery({
    queryKey: ['study-rooms', query, topic],

    queryFn: async () => {
      const result = await getStudyRoomsAction({ query, topic });
      if (result.error) throw new Error(result.error);

      return result.data;
    },
  });
};
