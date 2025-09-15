'use server';

import { revalidatePath } from 'next/cache';
import {
  createConversation,
  deleteConversation,
  getConversations,
  getMessages,
  renameConversation,
  sendAiTutorMessage,
} from '../api/ai.api';
import {
  CreateConversationInput,
  RenameConversationInput,
  TutorChatRequest,
  tutorChatRequestSchema,
} from '../schemas/chat.schema';

export const askAiTutor = async (
  data: TutorChatRequest
): Promise<{
  data?: { response: string; conversationId: string };
  error?: string;
}> => {
  const validation = tutorChatRequestSchema.safeParse(data);
  if (!validation.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const response = await sendAiTutorMessage(validation.data);

    //  revalidatePath('/studenat/ai-tools');
    revalidatePath('/');
    return { data: response };
  } catch (error) {
    console.error('AI Tutor action error:', error);

    return {
      error: 'Failed to get a response from the AI Tutor. Please try again.',
    };
  }
};

export const getConversationsAction = async (courseId: string) => {
  try {
    const conversations = await getConversations(courseId);

    return { data: conversations };
  } catch (error) {
    console.error('Get conversations action error:', error);

    return { error: 'Failed to fetch conversations.' };
  }
};

export const createConversationAction = async (
  data: CreateConversationInput
) => {
  try {
    const newConversation = await createConversation(data);

    // revalidatePath('/student/ai-tools');
    revalidatePath('/');
    return { data: newConversation };
  } catch (error) {
    console.error('Create conversation action error:', error);
    return { error: 'Failed to create new conversation.' };
  }
};

export const renameConversationAction = async (
  data: RenameConversationInput
) => {
  try {
    await renameConversation(data.conversationId, data.title);

    // revalidatePath('/student/ai-tools');
    revalidatePath('/');
    return { data: 'Success' };
  } catch (error) {
    console.error('Rename conversation action error:', error);

    return { error: 'Failed to rename conversation.' };
  }
};

export const deleteConversationAction = async (conversationId: string) => {
  try {
    await deleteConversation(conversationId);

    // revalidatePath('/student/ai-tools');
    revalidatePath('/');
    return { data: 'Success' };
  } catch (error) {
    console.error('Delete conversation action error:', error);

    return { error: 'Failed to delete conversation.' };
  }
};

export const getMessagesAction = async (conversationId: string) => {
  try {
    const messages = await getMessages(conversationId);

    return { data: messages };
  } catch (error) {
    console.error('Get messages action error:', error);

    return { error: 'Failed to fetch messages.' };
  }
};
