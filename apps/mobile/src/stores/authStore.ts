import {create} from "zustand/react";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";


type AuthUser = {
    id: number;
    email: string;
    username: string;
    universityId: number;
    facultyId: number;
    role?: string;
}

type AuthState = {
    user: AuthUser | null;
    accessToken: string | null;
    isLoggedIn: boolean;
    setSession: (user: AuthUser, accessToken: string) => void;
    clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isLoggedIn: false,
            setSession: (user, accessToken) =>
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
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
