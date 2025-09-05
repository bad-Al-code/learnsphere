'use client';

const refreshToken = async () => {
  try {
    const response = await fetch('/api/auth/refresh-token', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Refresh failed');
    }
    return true;
  } catch (error) {
    return false;
  }
};

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetchWithAuth(
    path: string,
    options?: RequestInit
  ): Promise<Response> {
    let response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      credentials: 'include',
    });

    if (response.status === 401) {
      const refreshed = await refreshToken();

      if (refreshed) {
        response = await fetch(`${this.baseUrl}${path}`, {
          ...options,
          credentials: 'include',
        });
      } else {
        window.location.href = '/logout';
      }
    }

    return response;
  }

  private getHeaders(extra?: HeadersInit): Headers {
    const headers = new Headers(extra);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  public async get(path: string, options?: RequestInit) {
    return this.fetchWithAuth(path, { ...options, method: 'GET' });
  }

  public async post(path: string, body: unknown, options?: RequestInit) {
    return this.fetchWithAuth(path, {
      ...options,
      method: 'POST',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    });
  }

  public async put(path: string, body: unknown, options?: RequestInit) {
    return this.fetchWithAuth(path, {
      ...options,
      method: 'PUT',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    });
  }

  public async patch(path: string, body: unknown, options?: RequestInit) {
    return this.fetchWithAuth(path, {
      ...options,
      method: 'PATCH',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    });
  }

  public async delete(path: string, options?: RequestInit) {
    return this.fetchWithAuth(path, {
      ...options,
      method: 'DELETE',
    });
  }
}

export const authService = new ApiClient(
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL!
);
export const userService = new ApiClient(
  process.env.NEXT_PUBLIC_USER_SERVICE_URL!
);
export const courseService = new ApiClient(
  process.env.NEXT_PUBLIC_COURSE_SERVICE_URL!
);
export const enrollmentService = new ApiClient(
  process.env.NEXT_PUBLIC_ENROLLMENT_SERVICE_URL!
);
export const paymentService = new ApiClient(
  process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL!
);
export const mediaService = new ApiClient(
  process.env.NEXT_PUBLIC_MEDIA_SERVICE_URL!
);
export const notificationService = new ApiClient(
  process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL!
);
