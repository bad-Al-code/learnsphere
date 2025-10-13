import { userService } from '@/lib/api/client';
import {
  JoinWaitlistInput,
  JoinWaitlistResponse,
  joinWaitlistResponseSchema,
  WaitlistStatusResponse,
  waitlistStatusResponseSchema,
} from '../schema/waitlist.schema';

export class WaitlistApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errors?: Array<{ message: string; field?: string }>
  ) {
    super(message);
    this.name = 'WaitlistApiError';
  }
}

/**
 * @description Calls the backend user-service to add an email to the waitlist.
 * @param data The data containing the email to be added.
 * @returns A promise that resolves with the validated response from the API.
 * @throws {WaitlistApiError} Throws an error if the API call fails.
 */
export const joinWaitlist = async (
  data: JoinWaitlistInput
): Promise<JoinWaitlistResponse> => {
  try {
    const response = await userService.postTyped<JoinWaitlistResponse>(
      '/api/users/waitlist',
      data
    );

    const validatedResponse = joinWaitlistResponseSchema.parse(response);
    return validatedResponse;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('already on the waitlist')) {
        throw new WaitlistApiError(
          'This email is already registered on our waitlist.',
          409
        );
      }

      if (error.message.includes('Disposable email')) {
        throw new WaitlistApiError(
          'Please use a valid email address. Temporary email services are not allowed.',
          400
        );
      }

      if (
        error.message.includes('invalid') ||
        error.message.includes('Invalid')
      ) {
        throw new WaitlistApiError('Please enter a valid email address.', 400);
      }

      throw new WaitlistApiError(
        error.message || 'Failed to join waitlist. Please try again.',
        500
      );
    }

    throw new WaitlistApiError(
      'An unexpected error occurred. Please try again.',
      500
    );
  }
};

/**
 * @description Checks if an email already exists in the waitlist
 * @param email The email to check
 * @returns A promise that resolves to true if email exists
 */
export const getWaitlistStatus = async (
  email: string
): Promise<WaitlistStatusResponse> => {
  try {
    const response = await userService.getTyped<{
      success: boolean;
      data: { exists: boolean };
    }>(`/api/users/waitlist/check?email=${encodeURIComponent(email)}`);

    return waitlistStatusResponseSchema.parse(response);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        throw new WaitlistApiError(
          'Could not find your entry on the waitlist.',
          404
        );
      }
      throw new WaitlistApiError(
        error.message || 'Failed to fetch waitlist status.',
        500
      );
    }
    throw new WaitlistApiError('An unexpected error occurred.', 500);
  }
};

/**
 * @description Gets waitlist statistics
 * @returns A promise that resolves with waitlist stats
 */
export const getWaitlistStats = async (): Promise<{ total: number }> => {
  try {
    const response = await userService.getTyped<{
      success: boolean;
      data: { total: number };
    }>('/api/users/waitlist/stats');

    return response.data;
  } catch (error) {
    console.error('Error getting waitlist stats:', error);
    return { total: 10_000 };
  }
};

/**
 * @description Updates the interests for a user on the waitlist.
 * @param data The data containing the user's email and their selected interests.
 * @returns A promise that resolves with a success message.
 * @throws {WaitlistApiError} If the API call fails.
 */
export const updateInterests = async (data: {
  email: string;
  interests: string[];
}): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await userService.putTyped<{
      success: boolean;
      message: string;
    }>('/api/users/waitlist/interests', data);

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new WaitlistApiError(
        error.message || 'Failed to update interests.',
        500
      );
    }

    throw new WaitlistApiError(
      'An unexpected error occurred. Please try again.',
      500
    );
  }
};
