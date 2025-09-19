'use server';

import { revalidatePath } from 'next/cache';

import {
  deleteIntegration,
  exportCourseToNotion,
  getGmailConnectUrl,
  getGoogleCalendarConnectUrl,
  getGoogleDriveConnectUrl,
  getIntegrations,
  getNotionConnectUrl,
} from '../api/integration.api';
import { ExportToNotionInput } from '../schema/notion.schema';

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

export const getNotionConnectUrlAction = async () => {
  try {
    return { data: await getNotionConnectUrl() };
  } catch (error) {
    return { error: 'Failed to initiate Notion connection.' };
  }
};

export const exportCourseToNotionAction = async (data: ExportToNotionInput) => {
  try {
    const result = await exportCourseToNotion(data);

    revalidatePath('/students/integrations');

    return { data: result };
  } catch (error) {
    return { error: 'Failed to export course to Notion.' };
  }
};
