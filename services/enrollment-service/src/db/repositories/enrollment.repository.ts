import { and, avg, eq, inArray } from 'drizzle-orm';

import { db } from '..';
import logger from '../../config/logger';
import { Enrollment, NewEnrollment, UpdateEnrollment } from '../../types';
import { enrollments, studentGrades } from '../schema';

export class EnrollRepository {
  /**
   * Creates a new enrollment record.
   * @param data The data for the new enrollment
   * @returns The newly created enrollment object
   */
  public static async create(data: NewEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db
      .insert(enrollments)
      .values(data)
      .returning();

    return newEnrollment;
  }

  /**
   * Finds a single enrollment by its unique ID.
   * @param enrollmentId - The ID of the enrollment.
   * @returns An enrollment object or undefined if not found.
   */
  public static async findById(
    enrollmentId: string
  ): Promise<Enrollment | undefined> {
    return db.query.enrollments.findFirst({
      where: eq(enrollments.id, enrollmentId),
    });
  }

  /**
   * Finds a single enrollment for a specific user in a specific course.
   * @param userId - The ID of the user.
   * @param courseId - The ID of the course.
   * @returns An enrollment object or undefined if not found.
   */
  public static async findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<Enrollment | undefined> {
    return db.query.enrollments.findFirst({
      where: and(
        eq(enrollments.userId, userId),
        eq(enrollments.courseId, courseId)
      ),
    });
  }

  /**
   * Finds all active and completed enrollments for a given user.
   * @param userId - The ID of the user.
   * @returns An array of the user's enrollments, ordered by most recently accessed.
   */
  public static async findActiveAndCompletedByUserId(
    userId: string
  ): Promise<Enrollment[]> {
    return db.query.enrollments.findMany({
      where: and(
        eq(enrollments.userId, userId),
        inArray(enrollments.status, ['active', 'completed'])
      ),
      orderBy: (enrollments, { desc }) => [desc(enrollments.lastAccessedAt)],
    });
  }

  /**
   * Finds all enrollments for a given course, with pagination.
   * @param courseId - The ID of the course.
   * @param limit - The number of results per page.
   * @param offset - The number of results to skip.
   * @returns An array of enrollment objects.
   */
  public static async findByCourseId(
    courseId: string,
    limit: number,
    offset: number
  ) {
    return db.query.enrollments.findMany({
      where: eq(enrollments.courseId, courseId),
      limit,
      offset,
      orderBy: (enrollments, { desc }) => [desc(enrollments.enrolledAt)],
    });
  }

  /**
   * Updates an enrollment record by its ID.
   * @param enrollmentId - The ID of the enrollment to update.
   * @param data - An object with the fields to update.
   * @returns The updated enrollment object.
   */
  public static async update(
    enrollmentId: string,
    data: UpdateEnrollment
  ): Promise<Enrollment> {
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(enrollments.id, enrollmentId))
      .returning();
    return updatedEnrollment;
  }

  /**
   * Calculates the average grade for a student, grouped by courseId.
   * This is the most granular, accurate data this service has locally.
   * @param studentId The ID of the student.
   * @returns An array of objects, each with a courseId and the average grade.
   */
  public static async getAverageGradesByCourse(
    studentId: string
  ): Promise<{ courseId: string; averageGrade: number }[]> {
    try {
      const result = await db
        .select({
          courseId: studentGrades.courseId,
          averageGrade: avg(studentGrades.grade),
        })
        .from(studentGrades)
        .where(eq(studentGrades.studentId, studentId))
        .groupBy(studentGrades.courseId);

      return result.map((row) => ({
        courseId: row.courseId,
        averageGrade: parseFloat(row.averageGrade || '0'),
      }));
    } catch (error) {
      logger.error(
        `Error fetching average grades by course for student ${studentId}: %o`,
        { error }
      );

      throw new Error('Database query for grades by course failed.');
    }
  }
}
