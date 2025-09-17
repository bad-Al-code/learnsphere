'use server';

import { revalidatePath } from 'next/cache';

import {
  deleteIntegration,
  getGmailConnectUrl,
  getGoogleCalendarConnectUrl,
  getGoogleDriveConnectUrl,
  getIntegrations,
} from '../api/integration.api';

export const getIntegrationsAction = async () => {
  try {
    return { data: await getIntegrations() };
  } catch (error) {
    return { error: 'Failed to fetch integrations.' };
  }
};

export const deleteIntegrationAction = async (integrationId: string) => {
  try {
    await deleteIntegration(integrationId);

    revalidatePath('/student/integrations');

    return { data: 'Success' };
  } catch (error) {
    return { error: 'Failed to disconnect integration.' };
  }
};

export const getGoogleCalendarConnectUrlAction = async () => {
  try {
    return { data: await getGoogleCalendarConnectUrl() };
  } catch (error) {
    return { error: 'Failed to initiate connection.' };
  }
};

export const getGoogleDriveConnectUrlAction = async () => {
  try {
    return { data: await getGoogleDriveConnectUrl() };
  } catch (error) {
    return { error: 'Failed to initiate connection.' };
  }
};

export const getGmailConnectUrlAction = async () => {
  try {
    return { data: await getGmailConnectUrl() };
  } catch (error) {
    return { error: 'Failed to initiate connection.' };
  }
};
