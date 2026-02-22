export interface LoginPayload {
    email: string,
    password: string,
}

export interface SignupPayload {
    username: string,
    email: string,
    password: string,
    universityId: number,
    facultyId: number
}

export interface LoginResponse {
    authUserDTO: AuthUser,
    accessToken: string,
    refreshToken: string,
}

export interface SignupResponse {
    message: string
}

export interface AuthUser {
    id: number,
    email: string,
    username: string,
    universityId: number,
    facultyId: number,
    hasOnboarded: boolean,
    role?: string
}

type AuthState = {
    user: AuthUser | null;
    accessToken: string | null;
    isLoggedIn: boolean;
    markOnboarded: () => void;
    setSession: (user: AuthUser, accessToken: string) => void;
    clearSession: () => void;
}