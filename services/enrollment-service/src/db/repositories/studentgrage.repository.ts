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
}
