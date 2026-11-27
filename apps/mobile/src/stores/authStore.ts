import {create} from "zustand/react";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";
import {AuthState} from "@/src/types/auth";
import {deleteRefreshToken} from "@/src/stores/secureStore";
import {queryClient} from "@/src/lib/queryClient";
import {useRideStore} from "@/src/stores/rideStore";
import {useRideRequestStore} from "@/src/stores/rideRequestStore";
import {useCarpoolDraftStore} from "@/src/stores/carpoolDraftStore";
import {useSelectedRideStore} from "@/src/stores/selectedRideStore";
import {useSelectedBookingStore} from "@/src/stores/selectedBookingStore";
import {stompService} from "@/src/services/stompService";

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isLoggedIn: false,
            markOnboarded: () => set((state) => ({
                user: state.user ? {...state.user, hasOnboarded: true} : null
            })),
            updateUser: (updatedUser) => set((state) => ({
                user: state.user ? {...state.user, ...updatedUser} : null
            })),
            setSession: (user, accessToken) => {
                Sentry.setUser({
                    id: String(user.id),
                    username: user.username,
                    email: user.email,
                });
                set({user, accessToken, isLoggedIn: true});
            },
            clearSession: async () => {
                Sentry.setUser(null);
                await deleteRefreshToken();
                queryClient.clear();
                useRideStore.getState().clearRideDetails();
                useRideRequestStore.getState().clearRideRequestDetails();
                useCarpoolDraftStore.getState().clearDrafts();
                useSelectedRideStore.getState().clearRide();
                useSelectedBookingStore.getState().clearBooking();
                stompService.disconnect();
                set({user: null, accessToken: null, isLoggedIn: false});
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
