import axios from "axios";
import {useAuthStore} from "@/src/stores/authStore";
import {getRefreshToken} from "@/src/stores/secureStore";


const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
})

api.interceptors.request.use(config => {
    if (config.headers?.requiresAuth) {
        const accessToken = useAuthStore.getState().accessToken;

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        delete config.headers.requiresAuth;
    }

    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (error.response?.status !== 401) {
            throw await Promise.reject(error);
        }

        const refreshToken = await getRefreshToken();
        if (!refreshToken) {
            useAuthStore.getState().clearSession();
            throw await Promise.reject(error);
        }

        const { data } = await api.post("/auth/refresh", { refreshToken });

        useAuthStore.getState().setSession(useAuthStore.getState().user, data.accessToken);

        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(error.config);
    }
);

api.interceptors.response.use(
    res => res,
    error => {
        if (!error.response) {
            console.log("Network error or server unreachable");
            return Promise.reject({
                type: "NETWORK_ERROR",
                message: "Unable to reach server",
            });
        }

        return Promise.reject(error);
    }
);

export default api;