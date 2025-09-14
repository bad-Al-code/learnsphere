import { Content } from '@google/genai';
import logger from '../../config/logger';
import { ForbiddenError, NotFoundError } from '../../errors';
import { AIRepository } from './ai.repository';
import { buildTutorInstruction } from './prompts/tutorInstruction.prompt';
import { Providers } from './providers';
import { tutorResponseSchema } from './schema/tutorResponse.schema';

export class AiService {
  private provider = Providers.google;

  /**
   * Generates a response from the AI Tutor within the context of a course conversation.
   * @param {string} userId - The ID of the user making the request.
   * @param {string} courseId - The ID of the course providing the context for the AI Tutor.
   * @param {string} prompt - The user's message or question to the AI Tutor.
   * @param {string} [conversationId] - Optional existing conversation ID to continue the chat.
   * @returns {Promise<{ response: string; conversationId: string }>}
   * @throws {ForbiddenError} If the user is not enrolled in the course or tries to access a conversation they do not own.
   * @throws {NotFoundError} If the course content cannot be found or is still syncing.
   */
  public async generateTutorResponse(
    userId: string,
    courseId: string,
    prompt: string,
    conversationId?: string
  ): Promise<{ response: string; conversationId: string }> {
    const isEnrolled = await AIRepository.isUserEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new ForbiddenError(
        'You must be enrolled in this course to use the AI Tutor.'
      );
    }

    const courseContent = await AIRepository.getCourseContent(courseId);
    if (!courseContent?.content) {
      throw new NotFoundError(
        'Course content not found or is currently being synced. Please try again shortly.'
      );
    }

    let conversation;
    if (conversationId) {
      const existingConversation =
        await AIRepository.findConversationById(conversationId);

      if (!existingConversation || existingConversation.userId !== userId) {
        throw new ForbiddenError();
      }

      conversation = existingConversation;
    } else {
      const initialTitle =
        prompt.substring(0, 40) + (prompt.length > 40 ? '...' : '');

      conversation = await AIRepository.createConversation(
        userId,
        courseId,
        initialTitle
      );
    }

    const history = await AIRepository.getMessages(conversation.id);

    const formattedHistory: Content[] = history
      .map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }))
      .reverse();

    const contents: Content[] = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: prompt }] },
    ];

    const systemInstruction = {
      role: 'system',
      parts: [{ text: buildTutorInstruction(courseContent.content) }],
    };

    const result = await this.provider.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: tutorResponseSchema,
        thinkingConfig: {
          thinkingBudget: 1000,
        },
      },
    });

    const rawResponseText = result.text;

    let finalResponseText = '';
    try {
      const jsonResponse = JSON.parse(rawResponseText!);

      finalResponseText =
        jsonResponse.answer || 'The AI returned an empty answer.';
    } catch (e) {
      logger.error('Failed to parse structured JSON object from Gemini', {
        rawResponse: rawResponseText,
        error: e,
      });
      finalResponseText =
        "I'm sorry, I encountered an issue processing the response. Please try again.";
    }

    await AIRepository.addMessage({
      conversationId: conversation.id,
      role: 'user',
      content: prompt,
    });

    await AIRepository.addMessage({
      conversationId: conversation.id,
      role: 'model',
      content: finalResponseText,
    });

    logger.info(
      `AI Tutor response generated for user ${userId} in course ${courseId}`
    );

    return { response: finalResponseText, conversationId: conversation.id };
  }

  /**
   * Retrieves messages for a specific conversation after verifying ownership.
   * @param conversationId The ID of the conversation.
   * @param userId The ID of the user making the request.
   * @returns A list of message objects.
   */
  public async getMessagesForConversation(
    conversationId: string,
    userId: string
  ) {
    const conversation =
      await AIRepository.findConversationById(conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new ForbiddenError();
    }

    return AIRepository.getMessages(conversationId);
  }

  /**
   * Creates a new, empty conversation.
   * @param userId The user creating the conversation.
   * @param courseId The course context for the conversation.
   * @returns The newly created conversation object.
   */
  public async createNewConversation(
    userId: string,
    courseId: string,
    title?: string
  ) {
    const isEnrolled = await AIRepository.isUserEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new ForbiddenError('You must be enrolled to start a conversation.');
    }

    return AIRepository.createConversation(
      userId,
      courseId,
      title || 'New Chat'
    );
  }

  /**
   * Retrieves all conversations for a given user.
   * @param userId The ID of the user.
   * @returns A list of conversation objects.
   */
  public async getConversationsForUser(userId: string) {
    return AIRepository.findConversationsByUserId(userId);
  }

  /**
   * Renames a conversation after verifying ownership.
   * @param conversationId The ID of the conversation.
   * @param newTitle The new title.
   * @param userId The ID of the user making the request.
   */
  public async renameConversation(
    conversationId: string,
    newTitle: string,
    userId: string
  ) {
    const conversation =
      await AIRepository.findConversationById(conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new ForbiddenError();
    }

    await AIRepository.updateConversationTitle(conversationId, newTitle);
  }

  /**
   * Deletes a conversation after verifying ownership.
   * @param conversationId The ID of the conversation.
   * @param userId The ID of the user making the request.
   */
  public async deleteConversation(conversationId: string, userId: string) {
    const conversation =
      await AIRepository.findConversationById(conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new ForbiddenError();
    }

    await AIRepository.deleteConversation(conversationId);
  }
}
