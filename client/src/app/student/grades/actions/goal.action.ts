import {
  createGoal,
  deleteGoal,
  getMyGoals,
  updateGoal,
} from '../api/goal.api.client';
import { CreateGoalInput, UpdateGoalInput } from '../schema';

/**
 * Server action to fetch the current user's study goals.
 * @returns An object with either the data or an error message.
 */
export const getMyGoalsAction = async () => {
  try {
    const data = await getMyGoals();

    return { data };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

/**
 * Server action to create a new study goal for the current user.
 * @param data The validated input data from the form.
 * @returns An object with either the data or an error message.
 */
export const createGoalAction = async (data: CreateGoalInput) => {
  try {
    const newGoal = await createGoal(data);

    return { data: newGoal };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

/**
 * Server action to update a study goal for the current user.
 * @param goalId The ID of the goal to update.
 * @param data The validated input data for the update.
 */
export const updateGoalAction = async (
  goalId: string,
  data: UpdateGoalInput
) => {
  try {
    const updatedGoal = await updateGoal(goalId, data);

    console.log(updatedGoal);
    return { data: updatedGoal };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};

/**
 * Server action to delete a study goal for the current user.
 * @param goalId The ID of the goal to delete.
 */
export const deleteGoalAction = async (goalId: string) => {
  try {
    await deleteGoal(goalId);

    console.log(deleteGoal);
    return { data: { success: true } };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
};
