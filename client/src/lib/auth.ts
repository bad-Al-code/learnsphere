import { getBaseUrl } from '@/lib/utils/get-base-url';

export async function refreshToken() {
  try {
    const response = await fetch(`${getBaseUrl()}/api/auth/refresh-token`, {
      method: 'POST',
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
