'use server';

import { courseService } from '@/lib/api/server';
import { revalidatePath } from 'next/cache';
import {
  getMyAIRecommendations,
  getMyPendingAssignments,
} from '../api/assignment.api';
import {
  AssignmentStatusFilter,
  AssignmentTypeFilter,
} from '../stores/assignment.store';

export const getMyPendingAssignmentsAction = async (params: {
  query?: string;
  status?: AssignmentStatusFilter;
  type?: AssignmentTypeFilter;
}) => {
  try {
    return { data: await getMyPendingAssignments(params) };
  } catch (error) {
    return { error: 'Could not load your pending assignments.' };
  }
};

export const getMyAIRecommendationsAction = async () => {
  try {
    return { data: await getMyAIRecommendations() };
  } catch (error) {
    return { error: 'Could not load AI recommendations.' };
  }
};

export const startAssignmentAction = async (assignmentId: string) => {
  try {
    await courseService.post(`/api/assignments/${assignmentId}/start`, {});

    revalidatePath('/student/assignments');
    return { data: 'Success' };
  } catch (error) {
    return { error: 'Failed to mark assignment as started.' };
  }
};
