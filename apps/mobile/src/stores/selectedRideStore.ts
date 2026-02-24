import {create} from "zustand/react"
import {RecentRideResponse} from "@/src/types/ride";

interface SelectedRideStore {
    ride: RecentRideResponse | null,
    setRide: (ride: RecentRideResponse) => void;
    clearRide: () => void;
}

export const useSelectedRideStore = create<SelectedRideStore>()((set) => ({
    ride: null,
    setRide: (ride) => set({ride}),
    clearRide: () => set({ride: null}),
}))