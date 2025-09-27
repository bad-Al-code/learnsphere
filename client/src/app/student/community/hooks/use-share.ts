'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useDebounce } from 'use-debounce';
import {
  inviteUsers,
  searchUsers,
  sendBulkInvites,
  sendEmailInvites,
} from '../api/share.api.client';
import { BulkInviteInput, InviteUsersInput } from '../schema';

export const useSendEmailInvites = () => {
  return useMutation({
    mutationFn: sendEmailInvites,
    onSuccess: (data) => {
      toast.success(data.message);
    },

    onError: (error) => {
      toast.error('Failed to send invites', { description: error.message });
    },
  });
};

export const useUserSearch = (query: string) => {
  const [debouncedQuery] = useDebounce(query, 500);
  return useQuery({
    queryKey: ['user-search', debouncedQuery],

    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
  });
};

export const useInviteUsers = () => {
  return useMutation({
    mutationFn: (data: InviteUsersInput) => inviteUsers(data),

    onSuccess: (data) => {
      toast.success(data.message);
    },

    onError: (error) => {
      toast.error('Failed to send invitations', { description: error.message });
    },
  });
};

export const useSendBulkInvites = () => {
  return useMutation({
    mutationFn: (data: BulkInviteInput) => sendBulkInvites(data),

    onSuccess: (data) => {
      toast.success(data.message);
    },

    onError: (error) => {
      toast.error('Failed to send bulk invitations', {
        description: error.message,
      });
    },
  });
};
