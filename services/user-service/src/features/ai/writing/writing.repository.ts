import { and, desc, eq } from 'drizzle-orm';

import { db } from '../../../db';
import {
  aiWritingAssignments,
  NewWritingAssignment,
  WritingAssignment,
} from '../../../db/schema';

export class WritingRepository {
  /**
   * Creates a new writing assignment.
   * @param data The data for the new assignment.
   * @returns The newly created assignment object.
   */
  public static async createAssignment(
    data: NewWritingAssignment
  ): Promise<WritingAssignment> {
    const [newAssignment] = await db
      .insert(aiWritingAssignments)
      .values(data)
      .returning();

    return newAssignment;
  }

  /**
   * Finds all writing assignments for a user within a course.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @returns A list of writing assignments, sorted by most recently updated.
   */
  public static async findAssignmentsByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<WritingAssignment[]> {
    return db.query.aiWritingAssignments.findMany({
      where: and(
        eq(aiWritingAssignments.userId, userId),
        eq(aiWritingAssignments.courseId, courseId)
      ),
      orderBy: [desc(aiWritingAssignments.updatedAt)],
    });
  }
}
