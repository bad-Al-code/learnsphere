'use server';

import { generateQuiz } from '../api/ai.api';
import {
  GenerateQuizInput,
  generateQuizInputSchema,
} from '../schemas/quiz.schema';

export const generateQuizAction = async (data: GenerateQuizInput) => {
  const validation = generateQuizInputSchema.safeParse(data);
  if (!validation.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const newQuiz = await generateQuiz(validation.data);

    return { data: newQuiz };
  } catch (error) {
    console.error('Generate quiz action error:', error);

    return { error: 'Failed to generate the quiz. Please try again.' };
  }
};
