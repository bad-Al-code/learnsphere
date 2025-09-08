import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrGetConversation } from '../api/chat.api';

export function useCreateConversation(onSuccess: (data: any) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recipientId: string) => createOrGetConversation(recipientId),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      onSuccess(data);
    },
  });
}
