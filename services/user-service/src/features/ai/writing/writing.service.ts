import { WritingAssignment } from '../../../db/schema';
import { ForbiddenError } from '../../../errors';
import { AIRepository } from '../ai.repository';
import { WritingRepository } from './writing.repository';

export class WritingService {
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
}
