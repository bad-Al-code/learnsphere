import { userService } from '@/lib/api/server';
import {
  ConnectGoogleResponse,
  PublicIntegration,
} from '../schema/integration.schema';

/**
 * Fetches the current user's connected integrations.
 */
export const getIntegrations = (): Promise<PublicIntegration[]> => {
  return userService.getTyped<PublicIntegration[]>('/api/users/integrations');
};

/**
 * Deletes/disconnects an integration by its ID.
 * @param integrationId The ID of the integration to delete.
 */
export const deleteIntegration = (integrationId: string): Promise<void> => {
  return userService.deleteTyped<void>(
    `/api/users/integrations/${integrationId}`
  );
};

export const getGoogleCalendarConnectUrl =
  (): Promise<ConnectGoogleResponse> => {
    return userService.getTyped<ConnectGoogleResponse>(
      '/api/users/integrations/google-calendar/connect'
    );
  };

export const getGoogleDriveConnectUrl = (): Promise<ConnectGoogleResponse> => {
  return userService.getTyped<ConnectGoogleResponse>(
    '/api/users/integrations/google-drive/connect'
  );
};

export const getGmailConnectUrl = (): Promise<ConnectGoogleResponse> => {
  return userService.getTyped<ConnectGoogleResponse>(
    '/api/users/integrations/gmail/connect'
  );
};
