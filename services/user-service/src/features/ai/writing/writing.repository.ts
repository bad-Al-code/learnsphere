import { and, desc, eq } from 'drizzle-orm';

import { db } from '../../../db';
import {
  aiWritingAssignments,
  aiWritingFeedback,
  NewWritingAssignment,
  NewWritingFeedback,
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

  /**
   * Finds a single writing assignment by its ID.
   * @param id The ID of the assignment.
   * @returns The assignment object or undefined if not found.
   */
  public static async findAssignmentById(
    id: string
  ): Promise<WritingAssignment | undefined> {
    return db.query.aiWritingAssignments.findFirst({
      where: eq(aiWritingAssignments.id, id),
    });
  }

  /**
   * Updates an assignment's title, content, or prompt.
   * @param id The ID of the assignment to update.
   * @param data The data to update.
   * @returns The updated assignment object.
   */
  public static async updateAssignment(
    id: string,
    data: { title?: string; content?: string; prompt?: string }
  ): Promise<WritingAssignment> {
    const [updatedAssignment] = await db
      .update(aiWritingAssignments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(aiWritingAssignments.id, id))
      .returning();

    return updatedAssignment;
  }

  /**
   * Deletes an assignment from the database.
   * @param id The ID of the assignment to delete.
   */
  public static async deleteAssignment(id: string): Promise<void> {
    await db
      .delete(aiWritingAssignments)
      .where(eq(aiWritingAssignments.id, id));
  }

  public static async addFeedback(data: NewWritingFeedback[]) {
    if (data.length === 0) return [];

    return db.insert(aiWritingFeedback).values(data).returning();
  }
}
