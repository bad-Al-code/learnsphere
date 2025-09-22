'use client';

import {
  courseService as clientCourseService,
  courseService,
} from '@/lib/api/client';
import { BulkCourse } from '@/types/course';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import {
  getMyAIRecommendationsAction,
  getMyPendingAssignmentsAction,
  startAssignmentAction,
} from '../actions/assignment.action';
import {
  EnrichedPendingAssignment,
  PendingAssignment,
} from '../schemas/assignment.schema';
import {
  AssignmentStatusFilter,
  AssignmentTypeFilter,
} from '../stores/assignment.store';

export const usePendingAssignments = (
  query?: string,
  status?: AssignmentStatusFilter,
  type?: AssignmentTypeFilter
) => {
  const { data: rawAssignments, ...queryInfo } = useQuery({
    queryKey: ['pending-assignments', query, status, type],

    queryFn: async () => {
      const result = await getMyPendingAssignmentsAction({
        query,
        status,
        type,
      });
      if (result.error) throw new Error(result.error);

      return result.data;
    },
  });

  const assignmentIds = React.useMemo(
    () => rawAssignments?.map((a) => a.id) || [],
    [rawAssignments]
  );
  const { data: draftStatuses, isLoading: isLoadingDrafts } = useQuery({
    queryKey: ['assignment-draft-statuses', assignmentIds],
    queryFn: async () => {
      const res = await clientCourseService.post(
        '/api/assignments/draft-statuses',
        { assignmentIds }
      );

      return new Set(res.data as string[]);
    },

    enabled: assignmentIds.length > 0,
  });

  const courseIds = React.useMemo(
    () =>
      rawAssignments
        ? [...new Set(rawAssignments.map((a: PendingAssignment) => a.courseId))]
        : [],
    [rawAssignments]
  );

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
    if (!rawAssignments || !courseDetails || !draftStatuses) return [];

    const courseMap = new Map(courseDetails.map((c) => [c.id, c.title]));

    return rawAssignments.map((assignment: PendingAssignment) => ({
      ...assignment,
      course: courseMap.get(assignment.courseId) || 'Unknown Course',
      isOverdue: assignment.dueDate
        ? new Date(assignment.dueDate) < new Date()
        : false,
      type: assignment.type,
      status: draftStatuses.has(assignment.id) ? 'In Progress' : 'Not Started',
      points: assignment.points,
    })) as EnrichedPendingAssignment[];
  }, [rawAssignments, courseDetails, draftStatuses]);

  return {
    data: enrichedData,
    isLoading: queryInfo.isLoading || isLoadingCourses || isLoadingDrafts,
    isError: queryInfo.isError || isErrorCourses,
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

export const useStartAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startAssignmentAction,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-assignments'] });
    },

    onError: (error) => {
      console.error(error);
    },
  });
};
