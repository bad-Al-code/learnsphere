'use client';

import { useMutation } from '@tanstack/react-query';
import { generateQuizAction, GenerateQuizActionResult } from '../actions/quiz';
import { GenerateQuizInput } from '../schemas/quiz.schema';

export const useGenerateQuiz = () => {
  return useMutation<GenerateQuizActionResult, Error, GenerateQuizInput>({
    mutationFn: generateQuizAction,
  });
};
