import { userService } from '@/lib/api/server';
import {
  Conversation,
  CreateConversationInput,
  Message,
  TutorChatRequest,
} from '../schemas/chat.schema';
import {
  CreateNoteInput,
  UpdateNoteInput,
  UserNote,
} from '../schemas/notes.schema';
import { GenerateQuizInput, Quiz } from '../schemas/quiz.schema';

/**
 * Sends a prompt to an AI Tutor conversation.
 * @param data The chat request data including courseId, prompt, and optional conversationId.
 * @returns The AI's response and the conversation ID.
 */
export const sendAiTutorMessage = (
  data: TutorChatRequest
): Promise<{ response: string; conversationId: string }> => {
  return userService.postTyped<{ response: string; conversationId: string }>(
    '/api/ai/tutor-chat',
    data
  );
};

/**
 * Fetches all AI Tutor conversations for the current user.
 * @returns A promise resolving to an array of conversation objects.
 */
export const getConversations = (courseId: string): Promise<Conversation[]> => {
  return userService.getTyped<Conversation[]>(
    `/api/ai/tutor/conversations?courseId=${courseId}`
  );
};

/**
 * Creates a new AI Tutor conversation.
 * @param data The data for the new conversation (courseId and optional title).
 * @returns A promise resolving to the newly created conversation object.
 */
export const createConversation = (
  data: CreateConversationInput
): Promise<Conversation> => {
  return userService.postTyped<Conversation>(
    '/api/ai/tutor/conversations',
    data
  );
};

/**
 * Renames an AI Tutor conversation.
 * @param id The ID of the conversation to rename.
 * @param title The new title for the conversation.
 * @returns A promise resolving to a success message.
 */
export const renameConversation = (
  id: string,
  title: string
): Promise<{ message: string }> => {
  return userService.patchTyped<{ message: string }>(
    `/api/ai/tutor/conversations/${id}`,
    { title }
  );
};

/**
 * Deletes an AI Tutor conversation.
 * @param id The ID of the conversation to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export const deleteConversation = (id: string): Promise<void> => {
  return userService.deleteTyped<void>(`/api/ai/tutor/conversations/${id}`);
};

/**
 * Fetches messages for a specific conversation.
 * @param id The ID of the conversation.
 * @returns A promise resolving to an array of message objects.
 */
export const getMessages = (id: string, page: number): Promise<Message[]> => {
  return userService.getTyped<Message[]>(
    `/api/ai/tutor/conversations/${id}/messages?page=${page}&limit=100`
  );
};

/**
 * Calls the backend to generate and save a new quiz.
 * @param data The quiz generation parameters.
 * @returns The newly created quiz object.
 */
export const generateQuiz = (data: GenerateQuizInput): Promise<Quiz> => {
  return userService.postTyped<Quiz>('/api/ai/tutor/generate-quiz', data);
};

export const getNotes = (courseId: string): Promise<UserNote[]> => {
  return userService.getTyped<UserNote[]>(`/api/ai/notes?courseId=${courseId}`);
};

export const createNote = (data: CreateNoteInput): Promise<UserNote> => {
  return userService.postTyped<UserNote>('/api/ai/notes', data);
};

export const updateNote = (data: UpdateNoteInput): Promise<UserNote> => {
  const { noteId, ...body } = data;
  return userService.putTyped<UserNote>(`/api/ai/notes/${noteId}`, body);
};

export const deleteNote = (noteId: string): Promise<void> => {
  return userService.deleteTyped<void>(`/api/ai/notes/${noteId}`);
};

export const analyzeNote = (noteId: string): Promise<UserNote> => {
  return userService.postTyped<UserNote>(`/api/ai/notes/${noteId}/analyze`, {});
};
