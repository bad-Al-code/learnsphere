import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";

type ServiceName =
  | "auth"
  | "user"
  | "course"
  | "enrollment"
  | "media"
  | "notification";

const serviceUrlMap: Record<ServiceName, string> = {
  auth: process.env.AUTH_SERVICE_URL!,
  user: process.env.USER_SERVICE_URL!,
  course: process.env.COURSE_SERVICE_URL!,
  enrollment: process.env.ENROLLMENT_SERVICE_URL!,
  media: process.env.MEDIA_SERVICE_URL!,
  notification: process.env.NOTIFICATION_SERVICE_URL!,
};

const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000";

export const createApiClient = (
  service: ServiceName,
  headers: { cookie?: string } = {}
): AxiosInstance => {
  const baseURL = serviceUrlMap[service];
  if (!baseURL) {
    throw new Error(`Service URL for "${service}" is not defined`);
  }

  const config: CreateAxiosDefaults = {
    baseURL,
    headers: { ...headers },
    withCredentials: true,
  };

  return axios.create(config);
};

export type ApiClient = (service: ServiceName) => AxiosInstance;
