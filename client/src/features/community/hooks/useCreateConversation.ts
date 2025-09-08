import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrGetConversation } from '../api/chat.api';
import { UserSearchResult } from '../types';

export function useCreateConversation(onSuccess: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipient: UserSearchResult) =>
      createOrGetConversation(recipient),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      onSuccess(data);
    },
  });
}
