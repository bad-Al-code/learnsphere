'use server';

import { revalidatePath } from 'next/cache';
import { joinWaitlist } from '../api/waitlist.api.client';
import { JoinWaitlistInput } from '../schema/waitlist.schema';

/**
 * @description Server action to add a user to the waitlist.
 * It provides a secure layer between the client and the API.
 * @param data The validated input data from the form.
 * @returns An object with either the success data or an error message.
 */
export const joinWaitlistAction = async (data: JoinWaitlistInput) => {
  try {
    const response = await joinWaitlist(data);

    revalidatePath('/');
    return { data: response };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: 'An unknown error occurred. Please try again.' };
  }
};
