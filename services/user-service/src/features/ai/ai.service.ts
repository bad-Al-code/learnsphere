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
   * Generates a response from the AI Tutor.
   * @param {string} userId The ID of the user making the request.
   * @param {string} courseId The ID of the course context.
   * @param {string} prompt The user's message/question.
   * @returns {Promise<string>} The AI model's response as a string.
   */
  public async generateTutorResponse(
    userId: string,
    courseId: string,
    prompt: string
  ): Promise<string> {
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

    const conversation = await AIRepository.findOrCreateConversation(
      userId,
      courseId
    );

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

    const responseText = result.text;

    await AIRepository.addMessage({
      conversationId: conversation.id,
      role: 'user',
      content: prompt,
    });

    await AIRepository.addMessage({
      conversationId: conversation.id,
      role: 'model',
      content: responseText!,
    });

    logger.info(
      `AI Tutor response generated for user ${userId} in course ${courseId}`
    );

    return responseText!;
  }
}
