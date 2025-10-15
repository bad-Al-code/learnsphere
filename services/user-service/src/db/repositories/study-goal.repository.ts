import { asc, eq } from 'drizzle-orm';

import { db } from '..';
import logger from '../../config/logger';
import {
  NewStudyGoal,
  StudyGoal,
  studyGoals,
  UpdateStudyGoal,
} from '../schema';

/**
 * @class StudyGoalRepository
 * @description Manages all database operations for the `study_goals` table.
 */
export class StudyGoalRepository {
  /**
   * Finds all study goals for a specific user.
   * @param userId The ID of the user.
   * @returns An array of the user's study goals, ordered by target date.
   */
  public static async findByUserId(userId: string): Promise<StudyGoal[]> {
    try {
      return db.query.studyGoals.findMany({
        where: eq(studyGoals.userId, userId),
        orderBy: [asc(studyGoals.targetDate)],
      });
    } catch (error) {
      logger.error(`Error fetching study goals for user ${userId}: %o`, {
        error,
      });
      throw new Error('Database query for study goals failed.');
    }
  }

  /**
   * Creates a new study goal in the database.
   * @param data The data for the new study goal.
   * @returns The newly created study goal.
   */
  public static async create(data: NewStudyGoal): Promise<StudyGoal> {
    try {
      const [newGoal] = await db.insert(studyGoals).values(data).returning();
      return newGoal;
    } catch (error) {
      logger.error('Error creating study goal in database', { error });
      throw new Error('Database insert for study goal failed.');
    }
  }

  /**
   * Finds a single study goal by its ID.
   * @param goalId The ID of the goal.
   * @returns The study goal object or undefined if not found.
   */
  public static async findById(goalId: string): Promise<StudyGoal | undefined> {
    try {
      return db.query.studyGoals.findFirst({
        where: eq(studyGoals.id, goalId),
      });
    } catch (error) {
      logger.error(`Error fetching study goal by ID ${goalId}`, { error });
      throw new Error('Database query for study goal by ID failed.');
    }
  }

  /**
   * Updates a study goal.
   * @param goalId The ID of the goal to update.
   * @param data The data to update.
   * @returns The updated study goal.
   */
  public static async update(
    goalId: string,
    data: UpdateStudyGoal
  ): Promise<StudyGoal> {
    try {
      const [updatedGoal] = await db
        .update(studyGoals)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(studyGoals.id, goalId))
        .returning();
      return updatedGoal;
    } catch (error) {
      logger.error(`Error updating study goal ${goalId}`, { error });
      throw new Error('Database update for study goal failed.');
    }
  }

  /**
   * Deletes a study goal by its ID.
   * @param goalId The ID of the goal to delete.
   */
  public static async delete(goalId: string): Promise<void> {
    try {
      await db.delete(studyGoals).where(eq(studyGoals.id, goalId));
    } catch (error) {
      logger.error(`Error deleting study goal ${goalId}`, { error });
      throw new Error('Database delete for study goal failed.');
    }
  }
}
