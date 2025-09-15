import { z } from 'zod';

export const quizOptionSchema = z.object({
  id: z.uuid(),
  questionId: z.uuid(),
  optionText: z.string(),
  isCorrect: z.boolean(),
});

export const quizQuestionSchema = z.object({
  id: z.uuid(),
  quizId: z.uuid(),
  questionText: z.string(),
  order: z.number(),
  options: z.array(quizOptionSchema),
});

export const quizSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  courseId: z.uuid(),
  topic: z.string(),
  difficulty: z.string(),
  createdAt: z.iso.datetime(),
  questions: z.array(quizQuestionSchema),
});

export const generateQuizInputSchema = z.object({
  courseId: z.uuid(),
  topic: z.string().min(3, 'Topic must be at least 3 characters.'),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
});

export type Quiz = z.infer<typeof quizSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type QuizOption = z.infer<typeof quizOptionSchema>;
export type GenerateQuizInput = z.infer<typeof generateQuizInputSchema>;
