/**
 * @fileoverview HTTP client configuration for API communication
 * @author Enterprise Development Team
 * @version 1.0.0
 * @compliance ISO/IEC 12207, CMMI Level 3+
 */

import axios from "axios";

/**
 * Axios HTTP client instance with enterprise configuration
 *
 * Features:
 * - Configurable base URL via environment variable
 * - 10 second timeout for requests
 * - Automatic credential inclusion for CORS
 * - Request/response interceptors for token handling
 *
 * @example
 * ```typescript
 * import httpClient from '@/api/httpClient';
 *
 * const response = await httpClient.post('/api/v1/auth/login', credentials);
 * ```
 */
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,,
  timeout: 10000,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor to add authentication token
 */
httpClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor to handle common errors and token refresh
 */
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401/403 errors with token refresh attempt
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      // Skip refresh for auth endpoints to avoid infinite loops
      if (originalRequest.url?.includes("/auth/")) {
        return Promise.reject(error);
      }

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Attempt token refresh
        const refreshResponse = await httpClient.post("/auth/tokens/refresh", {
          refreshToken,
        });

        if (refreshResponse.data.accessToken) {
          // Update stored tokens
          localStorage.setItem("accessToken", refreshResponse.data.accessToken);
          localStorage.setItem("refreshToken", refreshResponse.data.refreshToken);
          localStorage.setItem("tokenExpiry", (Date.now() + refreshResponse.data.expiresIn * 1000).toString());

          // Update authorization header for the retry
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;

          // Retry the original request
          return httpClient(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed in interceptor:", refreshError);

        // If refresh fails, clear tokens and let the error propagate
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("tokenExpiry");

        // Dispatch custom event for logout
        window.dispatchEvent(new CustomEvent("auth:session-expired"));

        return Promise.reject(error);
      }
    }

    // Handle other errors
    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    }

    return Promise.reject(error);
  },
);

export default httpClient;
