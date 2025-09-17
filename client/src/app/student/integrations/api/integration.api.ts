import { userService } from '@/lib/api/server';
import {
  ConnectGoogleResponse,
  PublicIntegration,
} from '../schema/integration.schema';

/**
 * Fetches the current user's connected integrations.
 * @returns {Promise<PublicIntegration[]>} A list of integrations
 * connected by the current user.
 */
export const getIntegrations = (): Promise<PublicIntegration[]> => {
  return userService.getTyped<PublicIntegration[]>('/api/users/integrations');
};

/**
 * Deletes/disconnects an integration by its ID.
 * @param {string} integrationId - The unique identifier of the integration to delete.
 * @returns {Promise<void>} Resolves when the integration has been successfully deleted.
 */
export const deleteIntegration = (integrationId: string): Promise<void> => {
  return userService.deleteTyped<void>(
    `/api/users/integrations/${integrationId}`
  );
};

/**
 * Retrieves the Google Calendar OAuth 2.0 connection URL.
 * Used to start the connection flow for Google Calendar.
 * @returns {Promise<ConnectGoogleResponse>} The Google Calendar connection URL and metadata.
 */
export const getGoogleCalendarConnectUrl =
  (): Promise<ConnectGoogleResponse> => {
    return userService.getTyped<ConnectGoogleResponse>(
      '/api/users/integrations/google-calendar/connect'
    );
  };

/**
 * Retrieves the Google Drive OAuth 2.0 connection URL.
 * Used to start the connection flow for Google Drive.
 * @returns {Promise<ConnectGoogleResponse>} The Google Drive connection URL and metadata.
 */
export const getGoogleDriveConnectUrl = (): Promise<ConnectGoogleResponse> => {
  return userService.getTyped<ConnectGoogleResponse>(
    '/api/users/integrations/google-drive/connect'
  );
};

/**
 * Retrieves the Gmail OAuth 2.0 connection URL.
 * Used to start the connection flow for Gmail.
 * @returns {Promise<ConnectGoogleResponse>} The Gmail connection URL and metadata.
 */
export const getGmailConnectUrl = (): Promise<ConnectGoogleResponse> => {
  return userService.getTyped<ConnectGoogleResponse>(
    '/api/users/integrations/gmail/connect'
  );
};
