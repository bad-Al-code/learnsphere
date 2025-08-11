import { eq } from 'drizzle-orm';
import { db } from '..';
import { NewCourse, UpdateCourse } from '../../types';
import { courses } from '../schema';

export class CourseRepository {
  /**
   * Inserts a new course or updates an existing one based on the primary key.
   * @param data The full course object to be inserted or used for updating.
   */
  public static async upsert(data: NewCourse): Promise<void> {
    await db
      .insert(courses)
      .values(data)
      .onConflictDoUpdate({
        target: courses.id,
        set: {
          title: data.title,
          instructorId: data.instructorId,
          price: data.price,
          currency: data.currency,
        },
      });
  }

  /**
   * Updates one or more fields of a specific course.
   * @param courseId The unique identifier of the course to update.
   * @param data An object containing the fields to update.
   */
  public static async update(
    courseId: string,
    data: UpdateCourse
  ): Promise<void> {
    await db.update(courses).set(data).where(eq(courses.id, courseId));
  }

  /**
   * Deletes a course from the local replica.
   * @param courseId The unique identifier of the course to delete.
   */
  public static async delete(courseId: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, courseId));
  }

  /**
   * Finds a single course by its unique identifier.
   * @param courseId The unique identifier of the course to find.
   * @returns The Course object if found, otherwise undefined.
   */
  public static async findById(
    courseId: string
  ): Promise<typeof courses.$inferSelect | undefined> {
    return db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });
  }
}
