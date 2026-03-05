import axios from "axios";
import {useAuthStore} from "@/src/stores/authStore";
import {getRefreshToken} from "@/src/stores/secureStore";
import {API_BASE_URL} from "@/src/constants";


const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 3000
})

type RefreshTokenResponse = {
    authUserDTO: any;
    accessToken: string;
    refreshToken: string;
}

api.interceptors.request.use(config => {
    if(config.headers?.skipAuth !== true) {
        const accessToken = useAuthStore.getState().accessToken;

        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }

    delete config.headers?.skipAuth;

    return config;
});

let refreshPromise: Promise<RefreshTokenResponse | null> | null = null;

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const originalRequest = error.config;

        // 1. If not 401 OR it's already a retry OR it's a refresh call itself failed -> Exit
        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url?.includes("/auth/refresh") ||
            originalRequest.url?.includes("/auth/signup") ||
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/forgetPassword") ||
            originalRequest.url?.includes("/auth/signup/verify")
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            // 2. Singleton Promise: If multiple requests hit 401, they all wait for this ONE call
            if (!refreshPromise) {
                refreshPromise = (async () => {
                    const refreshToken = await getRefreshToken();
                    if (!refreshToken) return null;

                    const {data} = await api.post("/auth/refresh", {refreshToken});
                    return data;
                })();
            }

            const refreshPromiseResponse = await refreshPromise;

            // Cleanup promise for next time a token expires
            refreshPromise = null;

            if (!refreshPromiseResponse?.accessToken) {
                useAuthStore.getState().clearSession();
                return Promise.reject(error);
            }

            // 3. Update store and retry the original request
            const user = refreshPromiseResponse.authUserDTO;
            const accessToken = refreshPromiseResponse.accessToken;
            const refreshToken = refreshPromiseResponse.refreshToken;

            useAuthStore.getState().setSession(user, accessToken);
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            refreshPromise = null;
            useAuthStore.getState().clearSession();
            return Promise.reject(error);
        }
    }
);

export default api;