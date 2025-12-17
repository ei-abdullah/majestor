import {create} from "zustand/react";

type AuthUser = {
    id: string;
    email: string;
    username: string;
    universityId: number;
    facultyId: number;
    role?: string;
}

type AuthStore = {
    user: AuthUser | null;
    accessToken: string | null;
    isLoggedIn: boolean;
    setSession: (user: AuthUser, accessToken: string) => void;
    clearSession: () => void;
}


export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    accessToken: null,
    isLoggedIn: false,

    setSession: (user: AuthUser, accessToken: string) =>
        set({
            user,
            accessToken,
            isLoggedIn: true,
        }),

    clearSession: () =>
        set({
            user: null,
            accessToken: null,
            isLoggedIn: false,
        }),
}));
