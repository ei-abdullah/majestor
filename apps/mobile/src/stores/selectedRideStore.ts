import {create} from "zustand/react"
import {RecentRideResponse} from "@/src/types/ride";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SelectedRideStore {
    ride: RecentRideResponse | null,
    setRide: (ride: RecentRideResponse) => void;
    clearRide: () => void;
}

export const useSelectedRideStore = create<SelectedRideStore>()(
    persist(
        (set) => ({
            ride: null,
            setRide: (ride) => set({ride}),
            clearRide: () => set({ride: null}),
        }),
        {
            name: 'selected-ride-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)
