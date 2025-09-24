import logger from '../../config/logger';
import { DraftRepository } from '../../db/repostiories';
import { BadRequestError, NotFoundError } from '../../errors';
import { AIFeedbackReadyPublisher } from '../../events/publisher';
import {
  buildAIAssignmentFeedbackPrompt,
  buildAIDraftSuggestionPrompt,
} from './ai.prompt';
import { AIRepository } from './ai.repository';
import {
  AIDraftSuggestionResponse,
  aiDraftSuggestionResponseSchema,
  aiDraftSuggestionZodSchema,
  assignmentFeedbackResponseSchema,
  assignmentFeedbackZodSchema,
} from './aiResponse.schema';
import { GeminiClient } from './client/gemini.client';

export class AIService {
  private static ai = GeminiClient.getInstance();
  private static model: string = 'gemini-2.5-flash-lite';

  /**
   * Fetches all existing AI feedback for a user from the database.
   * @param userId The ID of the user.
   * @returns A promise that resolves to a list of feedback records.
   */

  public static async getFeedbackForUser(userId: string) {
    logger.info(`Fetching existing AI feedback for user ${userId} from DB`);

    return AIRepository.findFeedbackByUserId(userId);
  }

  /**
   * Generates new AI feedback for a submission by calling the Gemini API and saving the result.
   * @param submissionId The ID of the submission to recheck.
   * @param userId The ID of the user requesting the recheck.
   */
  public static async generateFeedback(submissionId: string, userId: string) {
    logger.info(`Generating NEW AI feedback for submission ${submissionId}`);

    const submission = await AIRepository.findBySubmissionId(submissionId);
    if (!submission || submission.studentId !== userId) {
      throw new BadRequestError('Submission not found or access denied.');
    }

    await AIRepository.updateFeedbackStatus(submissionId, 'pending');

    const submissionContent = submission.content;
    if (!submissionContent) {
      throw new BadRequestError(
        'Cannot generate feedback for an empty submission.'
      );
    }
    const systemInstruction = buildAIAssignmentFeedbackPrompt(
      submission.assignment.course.title,
      submission.assignment.title,
      submissionContent
    );

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: 'Please provide feedback now.',

      config: {
        responseMimeType: 'application/json',
        systemInstruction,
        responseSchema: assignmentFeedbackResponseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response text from AI provider.');
    }

    const parsed = assignmentFeedbackZodSchema.safeParse(
      JSON.parse(response.text)
    );
    if (!parsed.success) {
      throw new Error('AI returned invalid data structure.');
    }

    await AIRepository.upsertFeedback(submissionId, userId, parsed.data);

    const publisher = new AIFeedbackReadyPublisher();
    await publisher.publish({
      submissionId: submission.id,
      studentId: submission.studentId,
      courseId: submission.courseId,
      assignmentTitle: submission.assignment.title,
      courseTitle: submission.assignment.course.title,
    });

    logger.info(
      `Feedback saved and notification event dispatched for submission ${submissionId}.`
    );
  }

  /**
   * Generates AI-based draft suggestions (content, structure, grammar, research, etc.)
   * for a given draft owned by the current user.
   * @param draftId - The ID of the draft to generate suggestions for.
   * @param userId - The ID of the user requesting suggestions.
   * @returns - A list of AI-generated draft suggestions.
   */
  public static async generateDraftSuggestions(
    draftId: string,
    userId: string
  ): Promise<AIDraftSuggestionResponse> {
    const draft = await DraftRepository.findById(draftId);
    if (!draft || draft.studentId !== userId) {
      throw new NotFoundError('Draft');
    }

    if (!draft.content) {
      return { suggestions: [] };
    }

    const systemInstruction = buildAIDraftSuggestionPrompt(
      draft.title,
      draft.content
    );

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: 'Generate suggestions now',
      config: {
        responseMimeType: 'application/json',
        responseSchema: aiDraftSuggestionResponseSchema,
        systemInstruction,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response text from AI provider.');
    }

    const parsed = aiDraftSuggestionZodSchema.safeParse(JSON.parse(text));
    if (!parsed.success) {
      logger.error('Validation error:', parsed.error.format());

      throw new Error(
        'AI returned invalid data structure for draft suggestions.'
      );
    }

    return parsed.data;
  }
}
