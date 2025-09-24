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

  public async get<T>(
    path: string,
    options?: RequestInit
  ): Promise<{ data: T }> {
    const response = await this.fetchWithAuth(path, {
      ...options,
      method: 'GET',
    });
    const data = await response.json();

    return { data };
  }

  public async post<T>(
    path: string,
    body: unknown,
    options?: RequestInit
  ): Promise<{ data: T }> {
    const response = await this.fetchWithAuth(path, {
      ...options,
      method: 'POST',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return { data };
  }

  public async put<T>(
    path: string,
    body: unknown,
    options?: RequestInit
  ): Promise<{ data: T }> {
    const response = await this.fetchWithAuth(path, {
      ...options,
      method: 'PUT',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return { data };
  }

  public async patch<T>(
    path: string,
    body: unknown,
    options?: RequestInit
  ): Promise<{ data: T }> {
    const response = await this.fetchWithAuth(path, {
      ...options,
      method: 'PATCH',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return { data };
  }

  public async delete<T>(
    path: string,
    options?: RequestInit
  ): Promise<{ data: T }> {
    const response = await this.fetchWithAuth(path, {
      ...options,
      method: 'DELETE',
    });

    const data = await response.json();

    return { data };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `API Error: ${response.status} ${response.statusText}`,
        errorBody
      );

      throw new Error(`Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  public async getTyped<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await this.fetchWithAuth(path, {
      ...options,
      method: 'GET',
    });

    return this.handleResponse<T>(response);
  }

  public async postTyped<T>(
    path: string,
    body: unknown,
    options?: RequestInit
  ): Promise<T> {
    const response = await this.fetchWithAuth(path, {
      ...options,
      method: 'POST',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  public async putTyped<T>(
    path: string,
    body: unknown,
    options?: RequestInit
  ): Promise<T> {
    const response = await this.fetchWithAuth(path, {
      ...options,
      method: 'PUT',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  public async patchTyped<T>(
    path: string,
    body: unknown,
    options?: RequestInit
  ): Promise<T> {
    const response = await this.fetchWithAuth(path, {
      ...options,
      method: 'PATCH',
      headers: this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    });

    return this.handleResponse<T>(response);
  }

  public async deleteTyped<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await this.fetchWithAuth(path, {
      ...options,
      method: 'DELETE',
    });

    return this.handleResponse<T>(response);
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
export const communityService = new ApiClient(
  process.env.NEXT_PUBLIC_COMMUNITY_SERVICE_URL!
);
