'use server';

import { sendAiTutorMessage } from '../api/ai.api';
import {
  TutorChatRequest,
  tutorChatRequestSchema,
} from '../schemas/chat.schema';

export const askAiTutor = async (
  data: TutorChatRequest
): Promise<{ data?: string; error?: string }> => {
  const validation = tutorChatRequestSchema.safeParse(data);
  if (!validation.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const response = await sendAiTutorMessage(validation.data);

    return { data: response.response };
  } catch (error) {
    console.error('AI Tutor action error:', error);

    return {
      error: 'Failed to get a response from the AI Tutor. Please try again.',
    };
  }
};
