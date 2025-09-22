import { z } from 'zod';

export const aiRecommendationSchema = z.object({
  id: z.uuid().optional(),
  priority: z.enum(['high', 'medium', 'low']),
  title: z.string(),
  description: z.string(),
  hours: z.number(),
  dueDate: z.string(),
});
export type AIRecommendation = z.infer<typeof aiRecommendationSchema>;

export const pendingAssignmentSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  courseId: z.uuid(),
  dueDate: z.iso.datetime().nullable(),
  type: z.enum(['individual', 'collaborative']).optional(),
  points: z.number(),
});
export type PendingAssignment = z.infer<typeof pendingAssignmentSchema>;

export const enrichedPendingAssignmentSchema = pendingAssignmentSchema.extend({
  course: z.string(),
  isOverdue: z.boolean(),
  type: z.enum(['individual', 'collaborative']),
  status: z.enum(['Not Started', 'In Progress']),
  points: z.number(),
});
export type EnrichedPendingAssignment = z.infer<
  typeof enrichedPendingAssignmentSchema
>;
