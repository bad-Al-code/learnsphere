'use client';

import { useMutation } from '@tanstack/react-query';
import { askAiTutor } from '../actions/chat';
import { TutorChatRequest } from '../schemas/chat.schema';

type TutorChatActionResult = {
  data?: string;
  error?: string;
};

export const useAiTutorChat = () => {
  return useMutation<TutorChatActionResult, Error, TutorChatRequest>({
    mutationFn: askAiTutor,
  });
};
