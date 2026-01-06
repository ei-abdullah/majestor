import api from "@/src/services/index";
import {AxiosResponse} from "axios";
import {AuthUser} from "@/src/stores/authStore";

type LoginPayload = {
    email: string;
    password: string;
}

type SignupPayload = {
    username: string;
    email: string;
    password: string;
    universityId: number;
    facultyId: number;
}

type LoginResponse = {
    authUserDTO: AuthUser,
    accessToken: string;
    refreshToken: string;
}

type SignupResponse = {
    message: string;
}

export const login = async (payload: LoginPayload): Promise<AxiosResponse<LoginResponse>> =>
    api.post<LoginResponse>("/auth/login", payload, {
        headers: { skipAuth: true }
    });

export const signup = async (payload: SignupPayload): Promise<AxiosResponse<SignupResponse>> =>
    api.post<SignupResponse>("/auth/signup", payload, {
        headers: { skipAuth: true }
    });

