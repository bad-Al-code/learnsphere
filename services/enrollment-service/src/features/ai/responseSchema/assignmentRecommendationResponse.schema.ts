import { Type } from '@google/genai';
import z from 'zod';

export const assignmentResponse = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      priority: { type: Type.STRING },
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      hours: { type: Type.NUMBER },
      dueDate: { type: Type.STRING },
    },

    required: ['priority', 'title', 'description', 'hours', 'dueDate'],
  },
};

export const assignmentResponseSchema = z.array(
  z.object({
    priority: z.string(),
    title: z.string(),
    description: z.string(),
    hours: z.number(),
    dueDate: z.string(),
  })
);

export type AssignmentResponse = z.infer<typeof assignmentResponseSchema>;
