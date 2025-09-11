import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  addParticipantToGroup,
  removeParticipantFromGroup,
} from '../api/chat.api';

export function useManageParticipants(conversationId: string) {
  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ['participants', conversationId],
    });
    queryClient.invalidateQueries({ queryKey: ['conversations'] });
  };

  const addMutation = useMutation({
    mutationFn: (userId: string) =>
      addParticipantToGroup(conversationId, userId),

    onSuccess: () => {
      toast.success('Member added successfully!');
      onSuccess();
    },

    onError: () => toast.error('Failed to add member.'),
  });

  const removeMutation = useMutation({
    mutationFn: (userId: string) =>
      removeParticipantFromGroup(conversationId, userId),

    onSuccess: () => {
      toast.success('Member removed successfully!');
      onSuccess();
    },

    onError: () => toast.error('Failed to remove member.'),
  });

  return {
    addParticipant: addMutation.mutate,
    isAdding: addMutation.isPending,
    removeParticipant: removeMutation.mutate,
    isRemoving: removeMutation.isPending,
  };
}
