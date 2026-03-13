import {create} from "zustand/react";
import {GetBookingsResponse} from "@/src/types/booking";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SelectedBookingStore {
    booking: GetBookingsResponse | null;
    setBooking: (booking: GetBookingsResponse) => void;
    clearBooking: () => void;
}

export const useSelectedBookingStore = create<SelectedBookingStore>()(
    persist(
        (set) => ({
            booking: null,
            setBooking: (booking) => set({booking}),
            clearBooking: () => set({booking: null}),
        }),
        {
            name: 'selected-booking-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
