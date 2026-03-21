import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import * as Sentry from "@sentry/react-native";
import { useAuthStore } from "@/src/stores/authStore";
import { getRefreshToken, saveRefreshToken } from "@/src/stores/secureStore";

// Define the structure of the refresh response
type RefreshTokenResponse = {
    authUserDTO: any;
    accessToken: string;
    refreshToken: string;
};

// Singleton promise to handle concurrent refresh requests
let refreshPromise: Promise<string> | null = null;

const isPublicEndpoint = (url: string = "") => {
    return (
        url.includes("/auth/login") ||
        url.includes("/auth/signup") ||
        url.includes("/auth/forgetPassword") ||
        url.includes("/auth/signup/verify")
    );
};

export const setupInterceptors = (api: AxiosInstance) => {
    // 1. Request Interceptor: Attach Access Token
    api.interceptors.request.use(
        (config) => {
            if (config.headers?.skipAuth) {
                delete config.headers.skipAuth;
                return config;
            }

            const { accessToken } = useAuthStore.getState();
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    // 2. Response Interceptor: Sentry Error logging
    api.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            if (error.response && (error.response.status >= 500 || error.response.status === 400)) {
                Sentry.captureException(error, {
                    extra: {
                        url: error.config?.url,
                        method: error.config?.method,
                        status: error.response?.status,
                        data: error.response?.data,
                    },
                });
                // Mark as reported to distinguish in other error handlers
                (error as any)._sentryReported = true;
            }
            return Promise.reject(error);
        }
    );

    // 3. Response Interceptor: Handle Token Refresh
    api.interceptors.response.use(
        (res) => res,
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
            const status = error.response?.status;
            const url = originalRequest?.url || "";

            // Pass through if:
            // - Not an auth error (401 or 403)
            // - Already retried
            // - Is a public/auth endpoint (login/signup) preventing infinite loops
            if ((status !== 401 && status !== 403) || originalRequest._retry || isPublicEndpoint(url)) {
                return Promise.reject(error);
            }

            // Specific check: If the REFRESH call itself fails with 401/403, we must logout.
            if (url.includes("/auth/refresh")) {
                useAuthStore.getState().clearSession();
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            // If a refresh is already in progress, wait for it
            if (!refreshPromise) {
                refreshPromise = performTokenRefresh(api);
            }

            try {
                const newAccessToken = await refreshPromise;

                // Update the failed request's header with a new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                return api(originalRequest);
            } catch (refreshErr) {
                // If refresh failed (e.g., network error, or invalid refresh token)
                // We only clear session if it was an Auth failure, not network.
                // The performTokenRefresh function handles the clearing for Auth failures.
                return Promise.reject(refreshErr);
            } finally {
                // Clear the promise only after all waiting requests have processed/failed
                // (This is a simplified approach; ideally, we clear it when the promise settles)
                 refreshPromise = null;
            }
        }
    );
};

/**
 * Executes the refresh token flow with retry logic for network stability.
 * Returns the new Access Token string.
 */
const performTokenRefresh = async (api: AxiosInstance): Promise<string> => {
    try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        // Retry logic: 3 attempts with increasing delay
        let lastError: any;
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                if (attempt > 0) await new Promise(r => setTimeout(r, 1000 * attempt)); // 0s, 1s, 2s

                const { data } = await api.post<RefreshTokenResponse>(
                    "/auth/refresh",
                    { refreshToken },
                    { headers: { skipAuth: true } }
                );

                const { accessToken, authUserDTO, refreshToken: newRefreshToken } = data;

                // Update session state
                useAuthStore.getState().setSession(authUserDTO, accessToken);
                await saveRefreshToken(newRefreshToken);

                return accessToken;

            } catch (err: any) {
                lastError = err;
                // If the server explicitly rejects the refresh token (401/403), stop retrying and logout.
                if (err.response?.status === 401 || err.response?.status === 403) {
                    useAuthStore.getState().clearSession();
                    throw err;
                }
                // Otherwise (Network Error, 500, etc.), continue to next attempt
            }
        }

        // If loop finishes without success
        throw lastError;

    } catch (error: any) {
        Sentry.captureException(error);
        // Final catch for "No refresh token" or exhausted retries
        if (error.message === "No refresh token available") {
             useAuthStore.getState().clearSession();
        }
        throw error;
    }
};
