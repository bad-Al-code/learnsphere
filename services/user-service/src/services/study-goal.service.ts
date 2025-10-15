import logger from '../config/logger';
import { StudyGoalRepository } from '../db/repositories';
import { StudyGoalTypeEnum, UpdateStudyGoal } from '../db/schema';
import { ConflictError, ForbiddenError, NotFoundError } from '../errors';
import { CreateStudyGoalInput, UpdateStudyGoalInput } from '../schemas';
import { Requester } from '../types';

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

  /**
   * Creates a new study goal for a user.
   * @param data The data for the new goal.
   * @param requester The user creating the goal.
   * @returns The newly created study goal.
   * @throws {ConflictError} if an active goal of the same type already exists.
   */
  public static async createGoal(
    data: CreateStudyGoalInput,
    requester: Requester
  ) {
    logger.info(`User ${requester.id} attempting to create a new study goal.`);

    // const existingGoals = await StudyGoalRepository.findByUserId(requester.id);
    // const hasActiveDuplicate = existingGoals.some(
    //   (goal) => goal.type === data.type && !goal.isCompleted
    // );

    // if (hasActiveDuplicate) {
    //   throw new ConflictError(
    //     `You already have an active goal of type "${data.type}". Please complete or delete it first.`
    //   );
    // }

    try {
      const newGoal = await StudyGoalRepository.create({
        ...data,
        userId: requester.id,
        targetDate: new Date(data.targetDate),
      });

      logger.info(
        `Successfully created new study goal ${newGoal.id} for user ${requester.id}`
      );

      return newGoal;
    } catch (error) {
      logger.error(`Error creating study goal for user ${requester.id}: %o`, {
        error,
      });

      throw new Error('Could not create study goal.');
    }
  }

  /**
   * Updates a study goal after verifying ownership.
   * @param goalId The ID of the goal to update.
   * @param data The data to update.
   * @param requester The user making the request.
   * @returns The updated study goal.
   */
  public static async updateGoal(
    goalId: string,
    data: UpdateStudyGoalInput,
    requester: Requester
  ) {
    logger.info(`User ${requester.id} attempting to update goal ${goalId}`);

    const goal = await StudyGoalRepository.findById(goalId);
    if (!goal) {
      throw new NotFoundError('Study goal');
    }

    if (goal.userId !== requester.id) {
      throw new ForbiddenError(
        'You do not have permission to update this goal.'
      );
    }

    try {
      const updatePayload: UpdateStudyGoal = {
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
      };

      const updatedGoal = await StudyGoalRepository.update(
        goalId,
        updatePayload
      );
      logger.info(`Successfully updated goal ${goalId}`);

      return updatedGoal;
    } catch (error) {
      logger.error(`Error updating study goal ${goalId}: %o`, { error });
      throw new Error('Could not update study goal.');
    }
  }

  /**
   * Deletes a study goal after verifying ownership.
   * @param goalId The ID of the goal to delete.
   * @param requester The user making the request.
   * @throws {NotFoundError} if the goal is not found.
   * @throws {ForbiddenError} if the requester does not own the goal.
   */
  public static async deleteGoal(goalId: string, requester: Requester) {
    logger.info(`User ${requester.id} attempting to delete goal ${goalId}`);

    const goal = await StudyGoalRepository.findById(goalId);
    if (!goal) {
      logger.warn(`Attempted to delete goal ${goalId} which was not found.`);

      return;
    }

    if (goal.userId !== requester.id) {
      throw new ForbiddenError(
        'You do not have permission to delete this goal.'
      );
    }

    try {
      await StudyGoalRepository.delete(goalId);

      logger.info(`Successfully deleted goal ${goalId}`);
    } catch (error) {
      logger.error(`Error deleting study goal ${goalId}: %o`, { error });

      throw new Error('Could not delete study goal.');
    }
  }
}
