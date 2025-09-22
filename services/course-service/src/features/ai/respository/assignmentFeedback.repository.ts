import { eq } from 'drizzle-orm';

import { db } from '../../../db';
import { aiAssignmentFeedback } from '../../../db/schema';

export class AssignmentFeedbackRepository {
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
}
