'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMyNotificationsAction } from '../actions/notification.action';
import { markAllAsRead, markNotificationAsRead } from '../api/notification.api';
import { Notification } from '../schema/notification.schema';

export const useNotifications = () => {
  return useQuery<Notification[], Error>({
    queryKey: ['notifications'],

    queryFn: async () => {
      const result = await getMyNotificationsAction();
      if (result.error) throw new Error(result.error);

      return result.data as Notification[];
    },
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationAsRead,

    onSuccess: (updatedNotification) => {
      queryClient.setQueryData(
        ['notifications'],
        (oldData: Notification[] | undefined) =>
          oldData?.map((n) =>
            n.id === updatedNotification.id ? updatedNotification : n
          )
      );
    },

    onError: (error) => toast.error('Failed to mark notification as read.'),
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },

    onError: (error) => toast.error('Failed to mark all as read.'),
  });
};
