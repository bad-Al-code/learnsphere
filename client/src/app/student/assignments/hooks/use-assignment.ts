'use client';

import { courseService } from '@/lib/api/client';
import { BulkCourse } from '@/types/course';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  getMyAIRecommendationsAction,
  getMyPendingAssignmentsAction,
} from '../actions/assignment.action';
import { EnrichedPendingAssignment } from '../schemas/assignment.schema';

export const usePendingAssignments = (query?: string) => {
  const {
    data: rawAssignments,
    isLoading: isLoadingAssignments,
    isError: isErrorAssignments,
  } = useQuery({
    queryKey: ['pending-assignments', query],

    queryFn: async () => {
      const result = await getMyPendingAssignmentsAction(query);
      if (result.error) throw new Error(result.error);

      return result.data;
    },
  });

  const courseIds = rawAssignments
    ? [...new Set(rawAssignments.map((a) => a.courseId))]
    : [];

  const {
    data: courseDetails,
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
  } = useQuery({
    queryKey: ['courses', 'bulk', courseIds],

    queryFn: async () => {
      if (courseIds.length === 0) return [];
      const res = await courseService.post('/api/courses/bulk', { courseIds });

      return res.data as BulkCourse[];
    },

    enabled: !!rawAssignments && courseIds.length > 0,
  });

  const enrichedData = React.useMemo(() => {
    if (!rawAssignments || !courseDetails) return [];

    const courseMap = new Map(courseDetails.map((c) => [c.id, c.title]));

    return rawAssignments.map(
      (assignment) =>
        ({
          ...assignment,
          course: courseMap.get(assignment.courseId) || 'Unknown Course',
          isOverdue: assignment.dueDate
            ? new Date(assignment.dueDate) < new Date()
            : false,
          type: 'individual', // Placeholder
          status: 'Not Started', // Placeholder
          points: 100, // Placeholder
        }) as EnrichedPendingAssignment
    );
  }, [rawAssignments, courseDetails]);

  return {
    data: enrichedData,
    isLoading: isLoadingAssignments || isLoadingCourses,
    isError: isErrorAssignments || isErrorCourses,
  };
};

export const useAIRecommendations = () => {
  return useQuery({
    queryKey: ['ai-recommendations'],

    queryFn: async () => {
      const result = await getMyAIRecommendationsAction();
      if (result.error) throw new Error(result.error);

      return result.data?.map((rec) => ({ ...rec, id: crypto.randomUUID() }));
    },
  });
};
