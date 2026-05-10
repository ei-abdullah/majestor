import api from "@/src/services/index";
import {AxiosResponse} from "axios";
import {LoginPayload, LoginResponse, SignupPayload, SignupResponse} from "@/src/types/auth";


export const login = async (payload: LoginPayload): Promise<AxiosResponse<LoginResponse>> =>
    api.post<LoginResponse>("/auth/login", payload, {
        headers: { skipAuth: true }
    });

export const signup = async (payload: SignupPayload): Promise<AxiosResponse<SignupResponse>> =>
    api.post<SignupResponse>("/auth/signup", payload, {
        headers: { skipAuth: true }
    });

export const forgotPasswordApi = async (email: string): Promise<void> =>
    api.post("/auth/forgot-password", { email }, {
        headers: { skipAuth: true }
    });

