import {create} from "zustand/react";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import {AuthState} from "@/src/types/auth";

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isLoggedIn: false,
            markOnboarded: () => set((state) => ({
                user: state.user ? {...state.user, hasOnboarded: true} : null
            })),
            setSession: (user, accessToken) => {
                Sentry.setUser({
                    id: String(user.id),
                    username: user.username,
                    email: user.email,
                });
                set({user, accessToken, isLoggedIn: true});
            },
            clearSession: () => {
                Sentry.setUser(null);
                set({user: null, accessToken: null, isLoggedIn: false});
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
