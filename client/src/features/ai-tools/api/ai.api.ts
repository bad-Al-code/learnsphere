import { userService } from '@/lib/api/server';
import {
  Conversation,
  CreateConversationInput,
  Message,
  TutorChatRequest,
} from '../schemas/chat.schema';
import {
  CreateDeckInput,
  FlashcardDeck,
  GenerateCardsInput,
  RecordProgressInput,
  StudySessionResponse,
} from '../schemas/flashcard.schema';
import {
  CreateNoteInput,
  UpdateNoteInput,
  UserNote,
} from '../schemas/notes.schema';
import { GenerateQuizInput, Quiz } from '../schemas/quiz.schema';
import {
  PerformResearchInput,
  ResearchBoard,
  SaveFindingInput,
  TempFinding,
  UpdateFindingNotesInput,
} from '../schemas/research.schema';

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

export const performResearch = (
  data: PerformResearchInput
): Promise<TempFinding[]> => {
  return userService.postTyped<TempFinding[]>('/api/ai/research/query', data);
};

export const getResearchBoard = (courseId: string): Promise<ResearchBoard> => {
  return userService.getTyped<ResearchBoard>(
    `/api/ai/research/board?courseId=${courseId}`
  );
};

export const saveFinding = (data: SaveFindingInput): Promise<UserNote> => {
  return userService.postTyped<UserNote>(
    '/api/ai/research/board/findings',
    data
  );
};

export const updateFindingNotes = (
  data: UpdateFindingNotesInput
): Promise<UserNote> => {
  return userService.putTyped<UserNote>(
    `/api/ai/research/board/findings/${data.findingId}`,
    {
      userNotes: data.userNotes,
    }
  );
};

export const deleteFinding = (findingId: string): Promise<void> => {
  return userService.deleteTyped<void>(
    `/api/ai/research/board/findings/${findingId}`
  );
};

export const summarizeFinding = (findingId: string): Promise<UserNote> => {
  return userService.postTyped<UserNote>(
    `/api/ai/research/board/findings/${findingId}/summarize`,
    {}
  );
};

export const getDecks = (courseId: string): Promise<FlashcardDeck[]> => {
  return userService.getTyped<FlashcardDeck[]>(
    `/api/ai/flashcards/decks?courseId=${courseId}`
  );
};

export const createDeck = (data: CreateDeckInput): Promise<FlashcardDeck> => {
  return userService.postTyped<FlashcardDeck>('/api/ai/flashcards/decks', data);
};

export const deleteDeck = (deckId: string): Promise<void> => {
  return userService.deleteTyped<void>(`/api/ai/flashcards/decks/${deckId}`);
};

export const generateCards = (
  data: GenerateCardsInput
): Promise<FlashcardDeck> => {
  return userService.postTyped<FlashcardDeck>(
    `/api/ai/flashcards/decks/${data.deckId}/generate-cards`,
    data
  );
};

export const getStudySession = (
  deckId: string
): Promise<StudySessionResponse[]> => {
  return userService.getTyped<StudySessionResponse[]>(
    `/api/ai/flashcards/decks/${deckId}/study-session`
  );
};

export const recordProgress = (
  data: RecordProgressInput
): Promise<{ message: string }> => {
  return userService.postTyped<{ message: string }>(
    '/api/ai/flashcards/progress',
    data
  );
};
