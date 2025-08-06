import { eq } from 'drizzle-orm';
import { db } from '.';
import { Course, courses, NewCourse, UpdatedCourse } from './schema';

/**
 * @class CourseRepository
 * @description Manages database operations for the `courses` table.
 * This class provides static methods to interact with the courses data,
 * including creating, updating, and deleting course records.
 */
export class CourseRepository {
  /**
   * @static
   * @async
   * @method upsert
   * @description Inserts a new course or updates an existing one based on the primary key.
   * If a course with the same `id` already exists, it updates the instructor,
   * status, and prerequisite course ID. Otherwise, it creates a new record.
   * @param {NewCourse} data - The full course object to be inserted or used for updating.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  public static async upsert(data: NewCourse): Promise<void> {
    await db
      .insert(courses)
      .values(data)
      .onConflictDoUpdate({
        target: courses.id,
        set: {
          instructorId: data.instructorId,
          status: data.status,
          prerequisiteCourseId: data.prerequisiteCourseId,
        },
      });
  }

  /**
   * @static
   * @async
   * @method update
   * @description Updates one or more fields of a specific course.
   * @param {string} courseId - The unique identifier of the course to update.
   * @param {UpdatedCourse} data - An object containing the fields to update.
   * @returns {Promise<void>} A promise that resolves when the update operation is complete.
   */
  public static async update(
    courseId: string,
    data: UpdatedCourse
  ): Promise<void> {
    await db.update(courses).set(data).where(eq(courses.id, courseId));
  }

  /**
   * @static
   * @async
   * @method delete
   * @description Deletes a course from the database.
   * @param {string} courseId - The unique identifier of the course to delete.
   * @returns {Promise<void>} A promise that resolves when the deletion is complete.
   */
  public static async delete(courseId: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, courseId));
  }

  /**
   * @static
   * @async
   * @method findById
   * @description Finds a single course by its unique identifier.
   * This method queries the database for a course matching the provided `courseId`.
   * @param {string} courseId - The unique identifier of the course to find.
   * @returns {Promise<Course | undefined>} A promise that resolves with the `Course` object if found, otherwise it resolves with `undefined`.
   */
  public static async findById(courseId: string): Promise<Course | undefined> {
    return db.query.courses.findFirst({
      where: eq(courses.id, courseId),
    });
  }
}
