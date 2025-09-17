'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteIntegrationAction,
  getGoogleConnectUrlAction,
  getIntegrationsAction,
} from '../actions/integrations';

export const useGetIntegrations = () => {
  return useQuery({
    queryKey: ['integrations'],

    queryFn: async () => {
      const result = await getIntegrationsAction();
      if (result.error) throw new Error(result.error);

      return result.data;
    },
  });
};

export const useDeleteIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIntegrationAction,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
    },
  });
};

export const useConnectGoogle = () => {
  return useMutation({
    mutationFn: getGoogleConnectUrlAction,
  });
};
