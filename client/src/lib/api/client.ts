'use client';

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(extra?: HeadersInit): Headers {
    const headers = new Headers(extra);
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    return headers;
  }

  public async get(path: string, options?: RequestInit) {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'GET',
      credentials: 'include',
    });
  }

  public async post(path: string, body: unknown, options?: RequestInit) {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'POST',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
      credentials: 'include',
    });
  }

  public async put(path: string, body: unknown, options?: RequestInit) {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'PUT',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
      credentials: 'include',
    });
  }

  public async patch(path: string, body: unknown, options?: RequestInit) {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'PATCH',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
      credentials: 'include',
    });
  }

  public async delete(path: string, options?: RequestInit) {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'DELETE',
      credentials: 'include',
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
