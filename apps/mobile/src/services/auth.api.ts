import api from "@/src/services/index";
import {AxiosResponse} from "axios";

type LoginPayload = {
    email: string;
    password: string;
}

type SignupPayload = {
    email: string;
    password: string;
    username: string;
}

type LoginResponse = {
    authUserDTO: {
        id: string;
        email: string;
        username: string;
        universityId: number;
        facultyId: number;
        roles: string[];
    },
    accessToken: string;
    refreshToken: string;
}

export const login = (payload:LoginPayload): Promise<AxiosResponse<LoginResponse>> =>
    api.post<LoginResponse>("/auth/login", payload)

export const signup = (payload: SignupPayload) =>
    api.post("/auth/signup", payload)

