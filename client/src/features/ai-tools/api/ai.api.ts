import { userService } from '@/lib/api/server';
import { TutorChatRequest, TutorChatResponse } from '../schemas/chat.schema';

/**
 * Sends a prompt to the AI Tutor backend.
 * @param data The chat request data including courseId and prompt.
 * @returns The AI's response.
 */
export const sendAiTutorMessage = (
  data: TutorChatRequest
): Promise<TutorChatResponse> => {
  return userService.postTyped<TutorChatResponse>('/api/ai/tutor-chat', data);
};
