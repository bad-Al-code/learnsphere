import { cookies } from 'next/headers';

export class ApiError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function apiClient(
  baseUrl: string,
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');

  const headers = new Headers(options.headers);
  if (cookieHeader) {
    headers.set('Cookie', cookieHeader);
  }
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${baseUrl}${path}`, { ...options, headers });
  return response;
}

const createApiService = (baseUrl: string) => ({
  get: (path: string, options: RequestInit = {}) =>
    apiClient(baseUrl, path, { method: 'GET', ...options }),

  post: (path: string, body: any, options: RequestInit = {}) =>
    apiClient(baseUrl, path, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    }),

  put: (path: string, body: any, options: RequestInit = {}) =>
    apiClient(baseUrl, path, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...options,
    }),

  patch: (path: string, body: any, options: RequestInit = {}) =>
    apiClient(baseUrl, path, {
      method: 'PATCH',
      body: JSON.stringify(body),
      ...options,
    }),

  delete: (path: string, options: RequestInit = {}) =>
    apiClient(baseUrl, path, { method: 'DELETE', ...options }),
});

export const authService = createApiService(process.env.AUTH_SERVICE_URL!);
export const userService = createApiService(process.env.USER_SERVICE_URL!);
export const courseService = createApiService(process.env.COURSE_SERVICE_URL!);
export const paymentService = createApiService(
  process.env.PAYMENT_SERVICE_URL!
);
export const enrollmentService = createApiService(
  process.env.ENROLLMENT_SERVICE_URL!
);
export const mediaService = createApiService(process.env.MEDIA_SERVICE_URL!);
