import { cookies } from "next/headers";

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type ApiClientOptions = {
  path: string;
  baseUrl: string;
  options?: RequestInit;
};

async function apiClient({
  path,
  baseUrl,
  options = {},
}: ApiClientOptions): Promise<Response> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const headers = new Headers(options.headers);
  if (cookieHeader) {
    headers.set("Cookie", cookieHeader);
  }
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const url = `${baseUrl}${path}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // const responseData = await response.json().catch(() => ({}));

    // if (!response.ok) {
    //   const errorMessage =
    //     responseData.errors?.[0]?.message || response.statusText;
    //   throw new ApiError(errorMessage, response.status, responseData);
    // }

    return response;
  } catch (error) {
    // if (error instanceof ApiError) {
    //   throw error;
    // }

    throw new Error("An unexpected network error occurred.");
  }
}

export const authService = {
  get: (path: string, options: RequestInit = {}) =>
    apiClient({
      path,
      baseUrl: process.env.AUTH_SERVICE_URL!,
      options: { ...options, method: "GET" },
    }),

  post: (path: string, body: any, options: RequestInit = {}) =>
    apiClient({
      path,
      baseUrl: process.env.AUTH_SERVICE_URL!,
      options: { ...options, method: "POST", body: JSON.stringify(body) },
    }),

  patch: (path: string, body: any, options: RequestInit = {}) =>
    apiClient({
      path,
      baseUrl: process.env.AUTH_SERVICE_URL!,
      options: { ...options, method: "PATCH", body: JSON.stringify(body) },
    }),
};

export const userService = {
  get: (path: string, options: RequestInit = {}) =>
    apiClient({
      path,
      baseUrl: process.env.USER_SERVICE_URL!,
      options: { ...options, method: "GET" },
    }),

  put: (path: string, body: any, options: RequestInit = {}) =>
    apiClient({
      path,
      baseUrl: process.env.USER_SERVICE_URL!,
      options: { ...options, method: "PUT", body: JSON.stringify(body) },
    }),
};
