import { revalidatePath } from "next/cache";
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

async function apiClient(
  baseUrl: string,
  path: string,
  options: RequestInit = {}
): Promise<Response> {
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

  let response = await fetch(`${baseUrl}${path}`, { ...options, headers });

  if (response.status === 401 && path !== "/api/auth/refresh") {
    console.log("Access token expired or invalid. Attempting to refresh...");
    try {
      const refreshResponse = await fetch(
        `${process.env.AUTH_SERVICE_URL!}/api/auth/refresh`,
        {
          method: "POST",
          headers: { Cookie: cookieHeader },
        }
      );

      if (!refreshResponse.ok) {
        console.error("Failed to refresh token. User must log in again.");
        throw new ApiError(
          "Your session has expired. Please log in again.",
          401,
          {}
        );
      }

      console.log("Token refreshed successfully. Retrying original request.");

      const setCookieHeaders = refreshResponse.headers.getSetCookie();
      setCookieHeaders.forEach(async (cookie) => {
        const parts = cookie.split(";");
        const [name, value] = parts[0].split("=");
        (await cookies()).set(name, value, {
          httpOnly: true,
          path: "/",
        });
      });

      response = await fetch(`${baseUrl}${path}`, { ...options, headers });
    } catch (e) {
      (await cookies()).delete("token");
      (await cookies()).delete("refreshToken");
      revalidatePath("/");
      throw e;
    }
  }

  return response;
}

const createApiService = (baseUrl: string) => ({
  get: (path: string) => apiClient(baseUrl, path, { method: "GET" }),
  post: (path: string, body: any) =>
    apiClient(baseUrl, path, { method: "POST", body: JSON.stringify(body) }),
  put: (path: string, body: any) =>
    apiClient(baseUrl, path, { method: "PUT", body: JSON.stringify(body) }),
  patch: (path: string, body: any) =>
    apiClient(baseUrl, path, { method: "PATCH", body: JSON.stringify(body) }),
});

export const authService = createApiService(process.env.AUTH_SERVICE_URL!);
export const userService = createApiService(process.env.USER_SERVICE_URL!);
