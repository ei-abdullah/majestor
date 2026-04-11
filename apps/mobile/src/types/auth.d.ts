export interface LoginPayload {
    email: string,
    password: string,
}

export interface SignupPayload {
    username: string,
    email: string,
    password: string,
    universityId: number,
    facultyId: number,
    isFaculty: boolean
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
    username?: string,
    avatar?: string,
    hasOnboarded?: boolean,
    phone?: string,
    personalEmail?: string,
    isFaculty?: boolean,
    premiumUntil?: string,
    storageUsed?: number,
    storageLimit?: number,
    universityId?: number,
    university?: string,
    facultyId?: number,
    faculty?: string,
    roles?: string[],
    createdAt?: string,
    updatedAt?: string
}

type AuthState = {
    user: AuthUser | null;
    accessToken: string | null;
    isLoggedIn: boolean;
    markOnboarded: () => void;
    updateUser: (user: Partial<AuthUser>) => void;
    setSession: (user: AuthUser, accessToken: string) => void;
    clearSession: () => void;
}