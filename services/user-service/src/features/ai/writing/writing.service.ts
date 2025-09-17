import { WritingAssignment, WritingFeedback } from '../../../db/schema';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from '../../../errors';
import { AIRepository } from '../ai.repository';
import {
  buildDraftInstruction,
  buildFeedbackInstruction,
} from '../prompts/writing.prompt';
import { Providers } from '../providers';
import {
  draftResponseSchema,
  feedbackResponseSchema,
} from '../schema/writingResponse.schema';
import { WritingRepository } from './writing.repository';
import {
  DraftResponse,
  draftResponseSchemaZod,
  feedbackResponseSchemaZod,
} from './writing.schema';

export class WritingService {
  private static provider = Providers.google;
  private static model: string = 'gemini-2.5-flash-lite';

  /**
   * Creates a new assignment for a given user and course.
   * @param userId - The ID of the user creating the assignment.
   * @param courseId - The ID of the course the assignment belongs to.
   * @param title - The title of the assignment.
   * @param prompt - (Optional) A writing prompt or question for the assignment.
   * @param content - (Optional) The initial content or body of the assignment.
   * @returns The created assignment record.
   */
  public static async createAssignment(
    userId: string,
    courseId: string,
    title: string,
    prompt?: string,
    content?: string
  ): Promise<WritingAssignment> {
    const isEnrolled = await AIRepository.isUserEnrolled(userId, courseId);
    if (!isEnrolled) {
      throw new ForbiddenError(
        'You must be enrolled in this course to create an assignment.'
      );
    }

    return WritingRepository.createAssignment({
      userId,
      courseId,
      title,
      prompt,
      content,
    });
  }

  /**
   * Retrieves all assignments created by a specific user for a given course.
   * @param userId - The ID of the user whose assignments are being fetched.
   * @param courseId - The ID of the course the assignments belong to.
   * @returns A list of assignments associated with the given user and course.
   */
  public static async getAssignments(
    userId: string,
    courseId: string
  ): Promise<WritingAssignment[]> {
    return WritingRepository.findAssignmentsByUserAndCourse(userId, courseId);
  }

  /**
   * Updates a writing assignment after verifying that the user owns it.
   * @param assignmentId - The unique identifier of the assignment to update.
   * @param userId - The ID of the user requesting the update.
   * @param data - The fields to update (at least one of `title`, `content`, or `prompt`).
   * @returns The updated assignment record.
   */
  public static async updateAssignment(
    assignmentId: string,
    userId: string,
    data: { title?: string; content?: string; prompt?: string }
  ): Promise<WritingAssignment> {
    const assignment = await WritingRepository.findAssignmentById(assignmentId);
    if (!assignment || assignment.userId !== userId) {
      throw new ForbiddenError();
    }

    return WritingRepository.updateAssignment(assignmentId, data);
  }

  /**
   * Deletes a writing assignment after verifying that the user owns it.
   * @param assignmentId - The unique identifier of the assignment to delete.
   * @param userId - The ID of the user requesting the deletion.
   * @returns A promise that resolves when the assignment is deleted.
   * @throws {ForbiddenError} If the assignment does not exist or the user does not own it.
   */
  public static async deleteAssignment(
    assignmentId: string,
    userId: string
  ): Promise<void> {
    const assignment = await WritingRepository.findAssignmentById(assignmentId);
    if (!assignment || assignment.userId !== userId) {
      throw new ForbiddenError();
    }

    await WritingRepository.deleteAssignment(assignmentId);
  }

  /**
   * Generates a draft for a writing assignment using AI and saves it as an assignment.
   * @param userId - The ID of the user requesting the draft.
   * @param courseId - The ID of the course for which the draft is generated.
   * @param title - The title of the assignment.
   * @param prompt - The writing prompt to guide the draft generation.
   * @returns The created assignment with AI-generated draft content.
   */
  public static async generateDraft(
    userId: string,
    courseId: string,
    title: string,
    prompt: string
  ): Promise<WritingAssignment> {
    const isEnrolled = await AIRepository.isUserEnrolled(userId, courseId);
    if (!isEnrolled)
      throw new ForbiddenError('You must be enrolled to generate a draft.');

    const courseContent = await AIRepository.getCourseContent(courseId);
    if (!courseContent?.content)
      throw new NotFoundError('Course content not found.');

    const systemInstruction = buildDraftInstruction(
      courseContent.content,
      prompt
    );
    const apiPrompt = 'Generate the draft now.';

    const response = await this.provider.models.generateContent({
      model: this.model,
      contents: [
        {
          role: 'user',
          parts: [{ text: apiPrompt }],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        systemInstruction,
        responseSchema: draftResponseSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response text from AI provider.');
    }

    const parsed: DraftResponse = draftResponseSchemaZod.parse(
      JSON.parse(text)
    );

    return WritingRepository.createAssignment({
      userId,
      courseId,
      title,
      prompt,
      content: parsed.draftContent,
    });
  }

  /**
   * Requests AI-generated feedback for a user's assignment and saves it.
   * @param {string} assignmentId - The unique ID of the assignment to analyze.
   * @param {string} userId - The ID of the user requesting feedback. Must match the assignment owner.
   * @param {'Grammar' | 'Style' | 'Clarity' | 'Argument'} feedbackType - The type of feedback to request.
   * @returns {Promise<WritingFeedback[]>} An array of feedback objects saved to the repository.
   */
  public static async getFeedback(
    assignmentId: string,
    userId: string,
    feedbackType: 'Grammar' | 'Style' | 'Clarity' | 'Argument'
  ): Promise<WritingFeedback[]> {
    const assignment = await WritingRepository.findAssignmentById(assignmentId);
    if (!assignment || assignment.userId !== userId) throw new ForbiddenError();
    if (!assignment.content)
      throw new BadRequestError('Cannot analyze an empty document.');

    const courseContent = await AIRepository.getCourseContent(
      assignment.courseId
    );
    if (!courseContent?.content)
      throw new NotFoundError('Course content not found.');

    const systemInstruction = buildFeedbackInstruction(
      courseContent.content,
      assignment.content,
      feedbackType
    );
    const apiPrompt = "Provide your feedback now based on the user's text.";

    const response = await this.provider.models.generateContent({
      model: this.model,
      contents: [{ role: 'user', parts: [{ text: apiPrompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: feedbackResponseSchema,
        systemInstruction,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response text from AI provider.');
    }

    const parsed = feedbackResponseSchemaZod.parse(JSON.parse(text));
    if (parsed.suggestions.length === 0) {
      throw new Error('AI did not return any feedback suggestions.');
    }

    const feedbackToSave = parsed.suggestions.map((s) => ({
      assignmentId,
      feedbackType,
      feedbackText: JSON.stringify(s),
    }));

    return WritingRepository.addFeedback(feedbackToSave);
  }
}
