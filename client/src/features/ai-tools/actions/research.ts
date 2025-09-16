'use server';

import { revalidatePath } from 'next/cache';

import {
  deleteFinding,
  getResearchBoard,
  performResearch,
  saveFinding,
  summarizeFinding,
  updateFindingNotes,
} from '../api/ai.api';
import {
  PerformResearchInput,
  SaveFindingInput,
  UpdateFindingNotesInput,
} from '../schemas/research.schema';

export const performResearchAction = async (data: PerformResearchInput) => {
  try {
    return { data: await performResearch(data) };
  } catch (error) {
    return { error: 'Failed to perform research.' };
  }
};

export const getResearchBoardAction = async (courseId: string) => {
  try {
    return { data: await getResearchBoard(courseId) };
  } catch (error) {
    return { error: 'Failed to fetch research board.' };
  }
};

export const saveFindingAction = async (data: SaveFindingInput) => {
  try {
    const newFinding = await saveFinding(data);

    // revalidatePath('/student/ai-tools');
    revalidatePath('');
    return { data: newFinding };
  } catch (error) {
    return { error: 'Failed to save finding.' };
  }
};

export const updateFindingNotesAction = async (
  data: UpdateFindingNotesInput
) => {
  try {
    const updatedFinding = await updateFindingNotes(data);

    // revalidatePath('/student/ai-tools');
    revalidatePath('/');
    return { data: updatedFinding };
  } catch (error) {
    return { error: 'Failed to update notes.' };
  }
};

export const deleteFindingAction = async (findingId: string) => {
  try {
    await deleteFinding(findingId);

    // revalidatePath('/student/ai-tools');
    revalidatePath('/');
    return { data: 'Success' };
  } catch (error) {
    return { error: 'Failed to delete finding.' };
  }
};

export const summarizeFindingAction = async (findingId: string) => {
  try {
    const updatedFinding = await summarizeFinding(findingId);

    // revalidatePath('/student/ai-tools');
    revalidatePath('/');
    return { data: updatedFinding };
  } catch (error) {
    return { error: 'Failed to generate summary.' };
  }
};
