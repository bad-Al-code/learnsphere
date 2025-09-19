'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyEnrolledCoursesAction } from '../actions/enrollment.action';

export const useMyEnrolledCourses = () => {
  return useQuery({
    queryKey: ['enrolled-courses'],

    queryFn: async () => {
      const result = await getMyEnrolledCoursesAction();

      if (result.error) {
        throw new Error(result.error);
      }

      return result.data;
    },
  });
};
