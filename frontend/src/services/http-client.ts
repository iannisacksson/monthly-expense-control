import axios from "axios";
import { useAuthStore } from "../store";

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean };
    const requestUrl = originalRequest?.url ?? "";
    const isAuthBoundaryRequest = requestUrl.includes("/auth/login")
      || requestUrl.includes("/auth/register")
      || requestUrl.includes("/auth/refresh");

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthBoundaryRequest) {
      originalRequest._retry = true;

      return httpClient.post("/auth/refresh")
        .then(() => httpClient(originalRequest))
        .catch((refreshError) => {
          useAuthStore.getState().clearSession();
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        });
    }

    return Promise.reject(error);
  }
);

export default httpClient;
