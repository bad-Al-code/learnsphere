import { and, eq } from 'drizzle-orm';

import { db } from '../../db';
import { enrollments, replicatedCourseContent } from '../../db/schema';

export class AIRepository {
  /**
   * Inserts or updates a record in the replicated_course_content table.
   * If a record with the given courseId already exists, it updates the content and updatedAt fields. Otherwise, it inserts a new record.
   * @param courseId The UUID of the course.
   * @param content The full text content of the course.
   */
  public static async upsertCourseContent(
    courseId: string,
    content: string
  ): Promise<void> {
    await db
      .insert(replicatedCourseContent)
      .values({ courseId, content, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: replicatedCourseContent.courseId,
        set: { content, updatedAt: new Date() },
      });
  }

  /**
   * Deletes a record from the replicated_course_content table.
   * @param courseId The UUID of the course to delete.
   */
  public static async deleteCourseContent(courseId: string): Promise<void> {
    await db
      .delete(replicatedCourseContent)
      .where(eq(replicatedCourseContent.courseId, courseId));
  }

  /**
   * Creates a new enrollment record in the local replica.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   */
  public static async addEnrollment(
    userId: string,
    courseId: string
  ): Promise<void> {
    await db
      .insert(enrollments)
      .values({ userId, courseId })
      .onConflictDoNothing();
  }

  /**
   * Checks if a user is enrolled in a course using the local replica.
   * @param userId The ID of the user.
   * @param courseId The ID of the course.
   * @returns True if an enrollment record exists, false otherwise.
   */
  public static async isUserEnrolled(
    userId: string,
    courseId: string
  ): Promise<boolean> {
    const result = await db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId)
      ),
    });

    return !!result;
  }
}
