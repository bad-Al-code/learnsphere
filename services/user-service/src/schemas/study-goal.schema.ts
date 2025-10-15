import { z } from 'zod';
import { studyGoalTypeEnum } from '../db/schema';

export const studyGoalQuerySchema = z.object({
  query: z.object({
    userId: z.string().min(1, 'userId is required').uuid(),
    type: z.enum(studyGoalTypeEnum.enumValues),
  }),
});

export type UserQuerySchema = z.infer<typeof studyGoalQuerySchema>['query'];
