import { BadRequestError } from '../../errors';
import { buildAIAssignmentFeedbackPrompt } from './ai.prompt';
import { AIRepository } from './ai.repository';
import {
  assignmentFeedbackResponseSchema,
  assignmentFeedbackZodSchema,
} from './aiResponse.schema';
import { GeminiClient } from './client/gemini.client';

export class AIFeedbackService {
  private static ai = GeminiClient.getInstance();
  private static model: string = 'gemini-2.5-flash-lite';

  public static async getFeedbackForUser(userId: string) {
    return AIRepository.findFeedbackByUserId(userId);
  }

  public static async generateFeedback(submissionId: string, userId: string) {
    const submission = await AIRepository.findBySubmissionId(submissionId);
    if (!submission || submission.studentId !== userId) {
      throw new BadRequestError('Submission not found or access denied.');
    }

    const submissionContent =
      "This is the student's submitted assignment text.";
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

    const [newFeedback] = await AIRepository.upsertFeedback(
      submissionId,
      userId,
      parsed.data
    );
    return newFeedback;
  }
}
