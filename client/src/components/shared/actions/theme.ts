'use server';

import z from 'zod';

import { userService } from '@/lib/api/server';

const updateThemeSchema = z.object({
  theme: z.enum(['dark', 'light']),
});
type UpdateThemePayload = z.infer<typeof updateThemeSchema>;

const updateThemePreference = (payload: UpdateThemePayload) => {
  return userService.patch('/api/users/me/settings', payload);
};

/**
 * A Server Action to update the user's theme preference in the database.
 * This function only runs on the server.
 * @param payload - The theme data to be updated.
 * @returns An object with either a success message or an error message.
 */
export const updateThemeAction = async (payload: UpdateThemePayload) => {
  try {
    const validation = updateThemeSchema.safeParse(payload);
    if (!validation.success) {
      throw new Error('Invalid theme provided.');
    }

    await updateThemePreference(validation.data);
  } catch (error) {
    console.error('Failed to save theme preference:', error);

    throw new Error('Failed to save theme preference.');
  }
};
