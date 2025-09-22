import { eq } from 'drizzle-orm';

import { db } from '../../db';
import { aiAssignmentFeedback, assignmentSubmissions } from '../../db/schema';
import { AssignmentFeedback } from './aiResponse.schema';

export class AIRepository {
  /**
   * Fetches all feedback records for a given user.
   * @param userId - The ID of the student whose feedback should be retrieved.
   * @returns - A promise that resolves to an array of feedback records.
   */
  public static async findFeedbackByUserId(userId: string) {
    return db.query.aiAssignmentFeedback.findMany({
      where: eq(aiAssignmentFeedback.studentId, userId),
      orderBy: (feedback, { desc }) => [desc(feedback.reviewedAt)],
    });
  }

  public static async findBySubmissionId(submissionId: string) {
    return db.query.assignmentSubmissions.findFirst({
      where: eq(assignmentSubmissions.id, submissionId),
      with: { assignment: { with: { course: true } } },
    });
  }

  public static async upsertFeedback(
    submissionId: string,
    studentId: string,
    feedback: AssignmentFeedback
  ) {
    return db
      .insert(aiAssignmentFeedback)
      .values({
        submissionId,
        studentId,
        score: feedback.score,
        summary: feedback.summary,
        detailedFeedback: feedback.detailedFeedback,
        suggestions: feedback.suggestions,
        reviewedAt: new Date(),
        status: 'reviewed',
      })
      .onConflictDoUpdate({
        target: aiAssignmentFeedback.submissionId,
        set: {
          score: feedback.score,
          summary: feedback.summary,
          detailedFeedback: feedback.detailedFeedback,
          suggestions: feedback.suggestions,
          reviewedAt: new Date(),
          status: 'reviewed',
        },
      })
      .returning();
  }
}
