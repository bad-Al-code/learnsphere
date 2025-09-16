'use server';

import { revalidatePath } from 'next/cache';

import {
  analyzeNote,
  createNote,
  deleteNote,
  getNotes,
  updateNote,
} from '../api/ai.api';
import { CreateNoteInput, UpdateNoteInput } from '../schemas/notes.schema';

export const getNotesAction = async (courseId: string) => {
  try {
    return { data: await getNotes(courseId) };
  } catch (error) {
    return { error: 'Failed to fetch notes.' };
  }
};

export const createNoteAction = async (data: CreateNoteInput) => {
  try {
    const newNote = await createNote(data);

    // revalidatePath('/student/ai-tools');
    revalidatePath('/');

    return { data: newNote };
  } catch (error) {
    return { error: 'Failed to create note.' };
  }
};

export const updateNoteAction = async (data: UpdateNoteInput) => {
  try {
    const updatedNote = await updateNote(data);

    // revalidatePath('/student/ai-tools');
    revalidatePath('/');

    return { data: updatedNote };
  } catch (error) {
    return { error: 'Failed to save note.' };
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    await deleteNote(noteId);
    // revalidatePath('/student/ai-tools');
    revalidatePath('/');

    return { data: 'Success' };
  } catch (error) {
    return { error: 'Failed to delete note.' };
  }
};

export const analyzeNoteAction = async (noteId: string) => {
  try {
    const analyzedNote = await analyzeNote(noteId);

    // revalidatePath('/student/ai-tools');
    revalidatePath('/');
    return { data: analyzedNote };
  } catch (error) {
    return { error: 'Failed to analyze note.' };
  }
};
