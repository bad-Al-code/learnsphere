'use server';

import { generateQuiz } from '../api/ai.api';
import {
  GenerateQuizInput,
  generateQuizInputSchema,
  Quiz,
} from '../schemas/quiz.schema';

export type GenerateQuizActionResult = {
  data?: Quiz;
  error?: string;
};

export const generateQuizAction = async (
  data: GenerateQuizInput
): Promise<GenerateQuizActionResult> => {
  const validation = generateQuizInputSchema.safeParse(data);
  if (!validation.success) {
    return { error: 'Invalid input. Please check your data.' };
  }

  try {
    const newQuiz = await generateQuiz(validation.data);

    return { data: newQuiz };
  } catch (error) {
    return {
      error: 'Failed to generate the quiz. Please try again.',
    };
  }
};
