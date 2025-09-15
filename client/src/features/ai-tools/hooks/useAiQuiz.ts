'use client';

import { useMutation } from '@tanstack/react-query';

import { generateQuizAction } from '../actions/quiz';
import { GenerateQuizInput, Quiz } from '../schemas/quiz.schema';

type GenerateQuizActionResult = {
  data?: Quiz;
  error?: string;
};

export const useGenerateQuiz = () => {
  return useMutation<GenerateQuizActionResult, Error, GenerateQuizInput>({
    mutationFn: generateQuizAction,
  });
};
