// src/api/interceptors.ts
import type {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../stores/authStore";
import { refreshTokenRequest } from "./authService";

// Extend config to mark a request as "already retried once"
// so we never retry the same request in an infinite loop.
interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Queue of callbacks waiting for a refresh-in-flight to finish.
let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

function resolveQueue(token: string) {
  pendingQueue.forEach((cb) => cb(token));
  pendingQueue = [];
}

export function attachAuthInterceptors(client: AxiosInstance) {
  // Attach current access token to every outgoing request.
  client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // On 401, try a silent refresh, then retry the original request once.
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as RetryConfig;

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      const { refreshToken, clearAuth, setAccessToken } =
        useAuthStore.getState();

      if (!refreshToken) {
        clearAuth();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // If a refresh is already happening, queue this request and
      // wait for the new token instead of firing a second refresh call.
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(client(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const { accessToken, refreshToken: newRefreshToken } =
          await refreshTokenRequest(refreshToken);

        setAccessToken(accessToken);
        useAuthStore.setState({ refreshToken: newRefreshToken });

        resolveQueue(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return client(originalRequest);
      } catch (refreshError) {
        clearAuth();
        pendingQueue = [];
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
