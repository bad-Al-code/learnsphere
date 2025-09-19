import { eq } from 'drizzle-orm';

import { db } from '../db';
import { studyGoals } from '../db/schema';

export class StudyGoalService {
  /**
   * Fetches all study goals for a specific user.
   * @param userId The ID of the user.
   * @returns An array of the user's study goals.
   */
  public static async getGoalsForUser(userId: string) {
    return db.query.studyGoals.findMany({
      where: eq(studyGoals.userId, userId),
      orderBy: (goals, { asc }) => [asc(goals.targetDate)],
    });
  }
}
