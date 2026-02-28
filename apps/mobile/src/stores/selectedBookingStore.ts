import {create} from "zustand/react";
import {GetBookingsResponse} from "@/src/types/booking";

interface SelectedBookingStore {
    booking: GetBookingsResponse | null;
    setBooking: (booking: GetBookingsResponse) => void;
    clearBooking: () => void;
}

export const useSelectedBookingStore = create<SelectedBookingStore>()((set) => ({
    booking: null,
    setBooking: (booking) => set({booking}),
    clearBooking: () => set({booking: null}),
}));

