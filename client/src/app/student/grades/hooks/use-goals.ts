'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  createGoalAction,
  deleteGoalAction,
  getMyGoalsAction,
  updateGoalAction,
} from '../actions/goal.action';
import { CreateGoalInput, Goal, UpdateGoalInput } from '../schema';

const GOALS_QUERY_KEY = ['study-goals'];

export const useStudyGoals = () => {
  return useQuery({
    queryKey: ['study-goals'],

    queryFn: async () => {
      const res = await getMyGoalsAction();
      if (res.error) {
        throw new Error(res.error);
      }

      return res.data;
    },
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGoalAction,
    onMutate: async (newGoal: CreateGoalInput) => {
      await queryClient.cancelQueries({ queryKey: GOALS_QUERY_KEY });

      const previousGoals = queryClient.getQueryData<Goal[]>(GOALS_QUERY_KEY);

      const optimisticGoal: Goal = {
        id: `optimistic-${Date.now()}`,
        ...newGoal,
        targetDate: newGoal.targetDate.toISOString(),
        currentValue: 0,
        isCompleted: false,
      };

      queryClient.setQueryData<Goal[]>(GOALS_QUERY_KEY, (old = []) => [
        ...old,
        optimisticGoal,
      ]);

      toast.success('Goal added!');

      return { previousGoals };
    },
    onError: (err, newGoal, context) => {
      toast.error('Failed to add goal', { description: err.message });

      if (context?.previousGoals) {
        queryClient.setQueryData(GOALS_QUERY_KEY, context.previousGoals);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, data }: { goalId: string; data: UpdateGoalInput }) =>
      updateGoalAction(goalId, data),
    onMutate: async ({ goalId, data }) => {
      await queryClient.cancelQueries({ queryKey: GOALS_QUERY_KEY });
      const previousGoals = queryClient.getQueryData<Goal[]>(GOALS_QUERY_KEY);

      queryClient.setQueryData<Goal[]>(GOALS_QUERY_KEY, (old = []) =>
        old.map((goal) =>
          goal.id === goalId
            ? {
                ...goal,
                ...data,
                targetDate: data.targetDate
                  ? data.targetDate.toISOString()
                  : goal.targetDate,
              }
            : goal
        )
      );

      toast.success('Goal updated!');

      return { previousGoals };
    },
    onError: (err, variables, context) => {
      toast.error('Failed to update goal', { description: err.message });

      if (context?.previousGoals) {
        queryClient.setQueryData(GOALS_QUERY_KEY, context.previousGoals);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (goalId: string) => deleteGoalAction(goalId),

    onMutate: async (goalId: string) => {
      await queryClient.cancelQueries({ queryKey: GOALS_QUERY_KEY });
      const previousGoals = queryClient.getQueryData<Goal[]>(GOALS_QUERY_KEY);

      queryClient.setQueryData<Goal[]>(GOALS_QUERY_KEY, (old = []) =>
        old.filter((goal) => goal.id !== goalId)
      );

      toast.success('Goal deleted.');

      return { previousGoals };
    },
    onError: (err, goalId, context) => {
      toast.error('Failed to delete goal', { description: err.message });

      if (context?.previousGoals) {
        queryClient.setQueryData(GOALS_QUERY_KEY, context.previousGoals);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: GOALS_QUERY_KEY });
    },
  });
};
