import { eq } from 'drizzle-orm';

import { db } from '../../db';
import { replicatedCourseContent } from '../../db/schema';

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
}
