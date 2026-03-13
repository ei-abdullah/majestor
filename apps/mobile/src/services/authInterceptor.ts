import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/src/stores/authStore";
import { getRefreshToken, saveRefreshToken } from "@/src/stores/secureStore";

// Define the structure of the refresh response
type RefreshTokenResponse = {
    authUserDTO: any;
    accessToken: string;
    refreshToken: string;
};

// Singleton promise to handle concurrent refresh requests (The "Thundering Herd" protection)
let refreshPromise: Promise<RefreshTokenResponse> | null = null;

const isAuthEndpoint = (url: string = "") => {
    return (
        url.includes("/auth/login") ||
        url.includes("/auth/signup") ||
        url.includes("/auth/forgetPassword") ||
        url.includes("/auth/signup/verify")
    );
};

export const setupInterceptors = (api: AxiosInstance) => {
    // 1. Request Interceptor: Attach Access Token
    api.interceptors.request.use((config) => {
        if (config.headers?.skipAuth) {
            delete config.headers.skipAuth;
            return config;
        }

        const { accessToken } = useAuthStore.getState();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    });

    // 2. Response Interceptor: Handle Token Refresh
    api.interceptors.response.use(
        (res) => res,
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
            const status = error.response?.status;
            const url = originalRequest?.url;

            // IF: Not 401, OR already retried, OR public auth endpoint -> Reject immediately
            if (status !== 401 || originalRequest._retry || isAuthEndpoint(url)) {
                return Promise.reject(error);
            }

            // IF: The refresh endpoint itself failed -> Session is dead -> Logout
            if (url?.includes("/auth/refresh")) {
                useAuthStore.getState().clearSession();
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            // Ensure only one refresh request happens at a time
            if (!refreshPromise) {
                refreshPromise = refreshAccessToken(api);
            }

            try {
                const { accessToken, refreshToken, authUserDTO } = await refreshPromise;

                // Update system state with new credentials
                useAuthStore.getState().setSession(authUserDTO, accessToken);
                await saveRefreshToken(refreshToken);

                // Retry the original request with a new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                
                return api(originalRequest);
            } catch (refreshErr: any) {
                // IMPORTANT: Only log out if:
                // 1. It's a definitive AUTH failure (401/403) from the refresh endpoint.
                // 2. Or the refresh token was missing entirely ("No refresh token available").
                // If it's a network error or server 500, keep the session so user can retry.
                const isAuthError = refreshErr.response?.status === 401 || refreshErr.response?.status === 403;
                const isMissingToken = refreshErr.message === "No refresh token available";

                if (isAuthError || isMissingToken) {
                    useAuthStore.getState().clearSession();
                }
                
                return Promise.reject(refreshErr);
            }
        }
    );
};

/**
 * Performs the actual refresh call.
 * Wrapped to be used in the singleton logic.
 * Includes retry logic to handle network instability on app wake-up.
 */
const refreshAccessToken = async (api: AxiosInstance): Promise<RefreshTokenResponse> => {
    try {
        const savedRefreshToken = await getRefreshToken();
        if (!savedRefreshToken) throw new Error("No refresh token available");

        // Retry mechanism: Try up to 3 times
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                // Add delay before retrying (0ms, 500ms, 1000ms)
                if (attempt > 0) await new Promise(r => setTimeout(r, 500 * attempt));

                const { data } = await api.post<RefreshTokenResponse>(
                    "/auth/refresh",
                    { refreshToken: savedRefreshToken },
                    { headers: { skipAuth: true } }
                );
                return data;
            } catch (error: any) {
                // Stop retrying immediately if token is invalid (401/403)
                if (error.response?.status === 401 || error.response?.status === 403) {
                    throw error;
                }
                // If this was the last attempt, throw the network error
                if (attempt === 2) throw error;
            }
        }
    } finally {
        refreshPromise = null;
    }
    
    throw new Error("Unexpected refresh flow error");
};
