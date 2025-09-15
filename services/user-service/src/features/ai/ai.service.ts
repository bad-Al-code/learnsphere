import { Content, GenerateContentResponse } from '@google/genai';
import logger from '../../config/logger';
import { ForbiddenError, NotFoundError } from '../../errors';
import { AIRepository } from './ai.repository';
import { quizResponseSchemaZod } from './ai.schema';
import { GeneratedQuiz } from './ai.types';
import { buildQuizInstruction } from './prompts/quizInstruction.prompt';
import { buildTutorInstruction } from './prompts/tutorInstruction.prompt';
import { Providers } from './providers';
import { quizResponseSchema } from './schema/quizResponse.schema';
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
    conversationId: string
  ): Promise<{ response: string; conversationId: string }> {
    const conversation =
      await AIRepository.findConversationById(conversationId);
    if (
      !conversation ||
      conversation.userId !== userId ||
      conversation.courseId !== courseId
    ) {
      throw new ForbiddenError();
    }

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

    // if (conversationId) {
    //   const existingConversation =
    //     await AIRepository.findConversationById(conversationId);

    //   if (!existingConversation || existingConversation.userId !== userId) {
    //     throw new ForbiddenError();
    //   }

    //   conversation = existingConversation;
    // } else {
    //   const initialTitle =
    //     prompt.substring(0, 40) + (prompt.length > 40 ? '...' : '');

    //   conversation = await AIRepository.createConversation(
    //     userId,
    //     courseId,
    //     initialTitle
    //   );
    // }

    const history = await AIRepository.getMessages(conversation.id);
    const isFirstMessage = history.length === 0;

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

    if (isFirstMessage) {
      const newTitle = this.generateConversationTitle(
        prompt,
        finalResponseText
      );
      await AIRepository.updateConversationTitle(conversation.id, newTitle);
    }

    logger.info(
      `AI Tutor response generated for user ${userId} in course ${courseId}`
    );

    return { response: finalResponseText, conversationId: conversation.id };
  }

  /**
   * Generates a meaningful title for the conversation based on the first prompt and AI response.
   * @param prompt The user's first message
   * @param aiResponse The AI's response
   * @returns A conversation title
   */
  private generateConversationTitle(
    prompt: string,
    aiResponse: string
  ): string {
    const promptWords = prompt
      .toLowerCase()
      .split(/\s+/)
      .filter(
        (word) =>
          word.length > 3 &&
          ![
            'what',
            'how',
            'why',
            'when',
            'where',
            'can',
            'could',
            'would',
            'should',
            'explain',
            'tell',
            'about',
          ].includes(word)
      );

    const keyWords = promptWords.slice(0, 4).join(' ');

    if (keyWords.length > 0) {
      const title = keyWords.replace(/\b\w/g, (l) => l.toUpperCase());
      return title.length > 50 ? title.substring(0, 47) + '...' : title;
    }

    return prompt.length > 50 ? prompt.substring(0, 47) + '...' : prompt;
  }

  /**
   * Retrieves messages for a specific conversation after verifying ownership.
   * @param conversationId The ID of the conversation.
   * @param userId The ID of the user making the request.
   * @returns A list of message objects.
   */
  public async getMessagesForConversation(
    conversationId: string,
    userId: string,
    options: { page: number; limit: number }
  ) {
    const conversation =
      await AIRepository.findConversationById(conversationId);
    if (!conversation || conversation.userId !== userId) {
      throw new ForbiddenError();
    }

    const offset = (options.page - 1) * options.limit;
    return AIRepository.getMessages(conversationId, options.limit, offset);
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
   * Retrieves all conversations for a given user for a specific course.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @returns A list of conversation objects.
   */
  public async getConversationsForUser(userId: string, courseId: string) {
    return AIRepository.findConversationsByUserAndCourse(userId, courseId);
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

  /**
   * Generates a quiz using Gemini and saves it in the database.
   * @param userId - ID of the user generating the quiz.
   * @param courseId - ID of the course the quiz belongs to.
   * @param topic - Topic for the quiz.
   * @param difficulty - Difficulty level of the quiz.
   * @returns The newly created quiz, including questions and options.
   */
  public async generateAndSaveQuiz(
    userId: string,
    courseId: string,
    topic: string,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  ) {
    const isEnrolled = await AIRepository.isUserEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new ForbiddenError('You must be enrolled to generate a quiz.');
    }

    const courseContent = await AIRepository.getCourseContent(courseId);
    if (!courseContent?.content) {
      throw new NotFoundError('Course content not found.');
    }

    const systemInstruction = buildQuizInstruction(
      courseContent.content,
      topic,
      difficulty
    );
    const prompt = `Generate the quiz now based on the topic "${topic}".`;

    const response: GenerateContentResponse =
      await this.provider.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction,
          responseSchema: quizResponseSchema,
        },
      });

    if (!response.text) {
      throw new Error('No response text received from GenAI');
    }

    const parsed = quizResponseSchemaZod.safeParse(JSON.parse(response.text));
    if (!parsed.success) {
      logger.error(parsed.error);
      throw new Error('Quiz response did not match expected schema');
    }

    const quizData: GeneratedQuiz = {
      topic,
      difficulty,
      questions: parsed.data.questions,
    };

    const newQuiz = await AIRepository.createQuiz(userId, courseId, quizData);

    logger.info(`New quiz ${newQuiz?.id} created for user ${userId}`);
    return newQuiz;
  }
}
