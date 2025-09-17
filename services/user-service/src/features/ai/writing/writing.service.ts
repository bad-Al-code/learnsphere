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
}
