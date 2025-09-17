'use server';

import { revalidatePath } from 'next/cache';

import {
  createAssignment,
  deleteAssignment,
  generateDraft,
  getFeedback,
  getWritingAssignments,
  updateAssignment,
} from '../api/ai.api';
import {
  CreateAssignmentInput,
  GenerateDraftInput,
  GetFeedbackInput,
  UpdateAssignmentInput,
} from '../schemas/writing.schema';

export const getWritingAssignmentsAction = async (courseId: string) => {
  try {
    return { data: await getWritingAssignments(courseId) };
  } catch (error) {
    return { error: 'Failed to fetch assignments.' };
  }
};

export const createAssignmentAction = async (data: CreateAssignmentInput) => {
  try {
    const newAssignment = await createAssignment(data);

    revalidatePath('/student/ai-tools');
    revalidatePath('/');

    return { data: newAssignment };
  } catch (error) {
    return { error: 'Failed to create assignment.' };
  }
};

export const updateAssignmentAction = async (data: UpdateAssignmentInput) => {
  try {
    const updatedAssignment = await updateAssignment(data);

    return { data: updatedAssignment };
  } catch (error) {
    return { error: 'Failed to save assignment.' };
  }
};

export const deleteAssignmentAction = async (assignmentId: string) => {
  try {
    await deleteAssignment(assignmentId);

    revalidatePath('/student/ai-tools');
    revalidatePath('/');

    return { data: 'Success' };
  } catch (error) {
    return { error: 'Failed to delete assignment.' };
  }
};

export const generateDraftAction = async (data: GenerateDraftInput) => {
  try {
    const newAssignment = await generateDraft(data);

    revalidatePath('/student/ai-tools');
    revalidatePath('/');

    return { data: newAssignment };
  } catch (error) {
    return { error: 'Failed to generate draft.' };
  }
};

export const getFeedbackAction = async (data: GetFeedbackInput) => {
  try {
    const feedback = await getFeedback(data);
    revalidatePath('/student/ai-tools');
    revalidatePath('/');

    return { data: feedback };
  } catch (error) {
    return { error: 'Failed to get feedback.' };
  }
};
