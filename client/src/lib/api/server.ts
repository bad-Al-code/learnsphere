import { cookies } from 'next/headers';

class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getHeaders(options?: HeadersInit): Promise<Headers> {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const cookieHeader = allCookies
      .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
      .join('; ');

    const headers = new Headers(options);
    headers.set('Content-Type', 'application/json');
    if (cookieHeader) {
      headers.set('Cookie', cookieHeader);
    }

    return headers;
  }

  public async get(path: string, options?: RequestInit) {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'GET',
      headers: await this.getHeaders(options?.headers),
      cache: 'no-store',
    });
  }

  public async post(path: string, body: unknown, options?: RequestInit) {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'POST',
      headers: await this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    });
  }

  public async put(path: string, body: unknown, options?: RequestInit) {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'PUT',
      headers: await this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    });
  }

  public async patch(path: string, body: unknown, options?: RequestInit) {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'PATCH',
      headers: await this.getHeaders(options?.headers),
      body: JSON.stringify(body),
    });
  }

  public async delete(path: string, options?: RequestInit) {
    return fetch(`${this.baseUrl}${path}`, {
      ...options,
      method: 'DELETE',
      headers: await this.getHeaders(options?.headers),
    });
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

    return response.json() as T;
  }

  public async postTyped<T>(
    path: string,
    body: unknown,
    options?: RequestInit
  ): Promise<T> {
    const response = await this.post(path, body, options);

    return this.handleResponse<T>(response);
  }

  public async getTyped<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await this.get(path, options);

    return this.handleResponse<T>(response);
  }

  public async putTyped<T>(
    path: string,
    body: unknown,
    options?: RequestInit
  ): Promise<T> {
    const response = await this.put(path, body, options);

    return this.handleResponse<T>(response);
  }

  public async patchTyped<T>(
    path: string,
    body: unknown,
    options?: RequestInit
  ): Promise<T> {
    const response = await this.patch(path, body, options);

    return this.handleResponse<T>(response);
  }

  public async deleteTyped<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await this.delete(path, options);

    return this.handleResponse<T>(response);
  }
}

export const authService = new ApiClient(process.env.AUTH_SERVICE_URL!);
export const userService = new ApiClient(process.env.USER_SERVICE_URL!);
export const courseService = new ApiClient(process.env.COURSE_SERVICE_URL!);
export const enrollmentService = new ApiClient(
  process.env.ENROLLMENT_SERVICE_URL!
);
export const paymentService = new ApiClient(process.env.PAYMENT_SERVICE_URL!);
export const mediaService = new ApiClient(process.env.MEDIA_SERVICE_URL!);
