import { userService } from '@/lib/api/client';
import { CreateGoalInput, Goal, UpdateGoalInput } from '../schema';

/**
 * Fetches the current user's study goals from the user-service.
 * @returns A promise that resolves to an array of goal objects.
 */
export const getMyGoals = async (): Promise<Goal[]> => {
  try {
    const response = await userService.getTyped<Goal[]>(
      '/api/users/me/study-goals'
    );

    return response;
  } catch (error) {
    console.error('Failed to fetch study goals:', error);
    throw new Error('Could not load your study goals.');
  }
};

/**
 * Creates a new study goal for the current user.
 * @param data The data for the new study goal.
 * @returns A promise that resolves to the newly created goal object.
 */
export const createGoal = async (data: CreateGoalInput): Promise<Goal> => {
  try {
    const payload = {
      ...data,
      targetDate: data.targetDate.toISOString(),
    };

    const response = await userService.postTyped<Goal>(
      '/api/users/me/study-goals',
      payload
    );

    return response;
  } catch (error) {
    console.error('Failed to create study goal:', error);
    throw error;
  }
};

/**
 * Updates an existing study goal for the current user.
 * @param goalId The ID of the goal to update.
 * @param data The data to update.
 * @returns A promise that resolves to the updated goal object.
 */
export const updateGoal = async (
  goalId: string,
  data: UpdateGoalInput
): Promise<Goal> => {
  try {
    const payload = {
      ...data,
      ...(data.targetDate && { targetDate: data.targetDate.toISOString() }),
    };
    const response = await userService.putTyped<Goal>(
      `/api/users/me/study-goals/${goalId}`,
      payload
    );

    return response;
  } catch (error) {
    console.error(`Failed to update study goal ${goalId}:`, error);
    throw new Error('Could not update your study goal.');
  }
};

/**
 * Deletes a study goal for the current user.
 * @param goalId The ID of the goal to delete.
 */
export const deleteGoal = async (goalId: string): Promise<void> => {
  try {
    await userService.deleteTyped(`/api/users/me/study-goals/${goalId}`);
  } catch (error) {
    console.error(`Failed to delete study goal ${goalId}:`, error);
    throw new Error('Could not delete your study goal.');
  }
};
