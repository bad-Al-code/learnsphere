'use client';

import { useQuery } from '@tanstack/react-query';
import {
  getLiveActivityFeedAction,
  getStudyGroupsAction,
} from '../actions/activity.action';

export const useLiveActivity = () => {
  return useQuery({
    queryKey: ['live-activity'],

    queryFn: async () => {
      const result = await getLiveActivityFeedAction();
      if (result.error) throw new Error(result.error);

      return result.data;
    },
  });
};

export const useStudyGroups = () => {
  return useQuery({
    queryKey: ['study-groups'],

    queryFn: async () => {
      const result = await getStudyGroupsAction();
      if (result.error) throw new Error(result.error);

      return result.data;
    },
  });
};
