import { Content, GoogleGenAI } from '@google/genai'; //
import { gemini } from '../../config/gemini';
import logger from '../../config/logger';
import { ForbiddenError, NotFoundError } from '../../errors';
import { AIRepository } from './ai.repository';

export class AiService {
  private gemini: GoogleGenAI;

  constructor() {
    this.gemini = gemini;
  }

  /**
   * Generates a response from the AI Tutor.
   * @param userId The ID of the user making the request.
   * @param courseId The ID of the course context.
   * @param prompt The user's message/question.
   * @returns The AI model's response as a string.
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
    if (!courseContent || !courseContent.content) {
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

    const model = this.gemini.models;

    const contents: Content[] = [
      ...formattedHistory,
      { role: 'user', parts: [{ text: prompt }] },
    ];

    const result = await model.generateContent({
      model: 'gemini-1.5-flash',
      contents: contents,
      config: {
        systemInstruction: {
          role: 'system',
          parts: [{ text: this.getSystemInstruction(courseContent.content) }],
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

  private getSystemInstruction(courseContent: string): string {
    return `You are "LearnSphere AI Tutor," an expert, friendly, and encouraging teaching assistant.
      Your goal is to help a student understand the content of a specific online course.
      You must ONLY answer questions based on the provided course content.
      If a user asks a question that is outside the scope of the provided content, you MUST politely decline and guide them back to topics covered in the course.
      Do not answer general knowledge questions.
      Your tone should be patient and supportive. Use formatting like markdown for code blocks, bold text for key terms, and bullet points for lists.

      HERE IS THE COURSE CONTENT:
      ---
      ${courseContent}
      ---
    `;
  }
}
