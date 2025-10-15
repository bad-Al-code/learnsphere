import logger from '../config/logger';
import { StudyGoalRepository } from '../db/repositories';
import { StudyGoalTypeEnum } from '../db/schema';
import { NotFoundError } from '../errors';

export class StudyGoalService {
  /**
   * Fetches all study goals for a specific user.
   * @param userId The ID of the user.
   * @returns An array of the user's study goals.
   */
  public static async getGoalsForUser(userId: string) {
    logger.debug(`Fetching all study goals for user: ${userId}`);

    try {
      return await StudyGoalRepository.findByUserId(userId);
    } catch (error) {
      logger.error(
        `Service error while fetching goals for user ${userId}: %o`,
        { error }
      );

      throw new Error('Could not retrieve study goals at this time.');
    }
  }

  /**
   * Fetches a specific type of study goal for a user.
   * @param userId The ID of the user.
   * @param type The type of the study goal to find.
   * @returns The study goal object.
   * @throws {NotFoundError} if no active goal of that type is found.
   */
  public static async getGoalByUserAndType(
    userId: string,
    type: StudyGoalTypeEnum
  ) {
    logger.debug(`Fetching goal of type "${type}" for user: ${userId}`);

    try {
      const goals = await StudyGoalRepository.findByUserId(userId);
      const goal = goals.find((g) => g.type === type && !g.isCompleted);

      if (!goal) {
        throw new NotFoundError('Active study goal of that type');
      }

      return goal;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      logger.error(
        `Service error while fetching goal by type for user ${userId}: %o`,
        { error }
      );

      throw new Error('Could not retrieve study goal by type.');
    }
  }
}
