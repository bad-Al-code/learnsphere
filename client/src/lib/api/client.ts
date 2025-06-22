import axios from "axios";

const API_GATEWAY_URL =
  process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_GATEWAY_URL,
  withCredentials: true,
});
