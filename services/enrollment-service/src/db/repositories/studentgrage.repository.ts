import { and, avg, eq } from 'drizzle-orm';
import { db } from '..';
import { NewStudentGrade, studentGrades } from '../schema';

export class StudentGradeRepository {
  /**
   * Inserts a new grade or updates an existing one based on the submission ID.
   * @param data The grade data from the event.
   */
  public static async upsert(data: NewStudentGrade): Promise<void> {
    await db
      .insert(studentGrades)
      .values(data)
      .onConflictDoUpdate({
        target: studentGrades.submissionId,
        set: {
          grade: data.grade,
          gradedAt: data.gradedAt,
        },
      });
  }

  /**
   * Calculates the average grade for a student in a specific course from the local replica.
   * @param courseId The ID of the course.
   * @param studentId The ID of the student.
   * @returns The average grade as a number, or null if no grades are found.
   */
  public static async getAverageGradeForCourse(
    courseId: string,
    studentId: string
  ): Promise<number | null> {
    const [result] = await db
      .select({
        averageGrade: avg(studentGrades.grade),
      })
      .from(studentGrades)
      .where(
        and(
          eq(studentGrades.courseId, courseId),
          eq(studentGrades.studentId, studentId)
        )
      );

    return result && result.averageGrade
      ? parseFloat(result.averageGrade)
      : null;
  }

  public static async hasSubmissions(
    courseId: string,
    studentId: string
  ): Promise<{ count: string | null }[]> {
    return await db
      .select({ count: studentGrades.id })
      .from(studentGrades)
      .where(
        and(
          eq(studentGrades.courseId, courseId),
          eq(studentGrades.studentId, studentId)
        )
      );
  }
}
