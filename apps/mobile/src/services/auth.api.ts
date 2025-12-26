import api from "@/src/services/index";
import {AxiosResponse} from "axios";

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
    authUserDTO: {
        id: number;
        email: string;
        username: string;
        universityId: number;
        facultyId: number;
        roles: string[];
    },
    accessToken: string;
    refreshToken: string;
}

type SignupResponse = {
    message: string;
}

export const login = async (payload:LoginPayload): Promise<AxiosResponse<LoginResponse>> =>
    api.post<LoginResponse>("/auth/login", payload)

export const signup = async (payload: SignupPayload): Promise<AxiosResponse<SignupResponse>> =>
    api.post<SignupResponse>("/auth/signup", payload)

