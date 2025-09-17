'use server';

import { revalidatePath } from 'next/cache';

import {
  deleteIntegration,
  getGoogleConnectUrl,
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

export const getGoogleConnectUrlAction = async () => {
  try {
    return { data: await getGoogleConnectUrl() };
  } catch (error) {
    return { error: 'Failed to initiate connection.' };
  }
};
