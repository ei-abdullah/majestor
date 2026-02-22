import {create} from "zustand/react"
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {RideData, RideState} from "@/src/types/ride";


const defaultState: RideData = {
    id: 0,
    startLocationLat: "",
    startLocationLng: "",
    startLocationAddress: "",
    endLocationLat: "",
    endLocationLng: "",
    endLocationAddress: "",
    routePolyline: "",
    availableSeats: 0,
    vehicleModal: "",
    vehicleType: "",
    licensePlate: "",
    rideStatus: "",
    phone: "",
    routeDistanceKm: 0,
};

export const useRideStore = create<RideState>()(
    persist(
        (set, get) => ({
            ...defaultState,

            setRideDetails: (rideDetails: Partial<RideData>) => {
                set(() => ({
                    ...rideDetails
                }))
            },

            clearRideDetails: () => set(() => ({...defaultState})),

            isEmpty: () => {
                const {id, startLocationAddress, endLocationAddress} = get();
                return id === 0 || startLocationAddress === "" || endLocationAddress === "";
            },
        }),
        {
            name: 'ride-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)