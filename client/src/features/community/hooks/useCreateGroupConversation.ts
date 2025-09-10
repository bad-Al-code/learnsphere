import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGroupConversation } from '../api/chat.api';
import { Conversation } from '../types';

interface CreateGroupPayload {
  name: string;
  participantIds: string[];
}

export function useCreateGroupConversation(
  onSuccess: (data: Conversation) => void
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, participantIds }: CreateGroupPayload) =>
      createGroupConversation(name, participantIds),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      onSuccess(data);
    },
  });
}
