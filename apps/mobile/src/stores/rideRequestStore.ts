import {create} from "zustand/react";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {RideRequestData, RideRequestState} from "@/src/types/rideRequest";


const defaultState: RideRequestData = {
    id: 0,
    pickupLocationLat: "",
    pickupLocationLng: "",
    pickupLocationAddress: "",
    dropoffLocationLat: "",
    dropoffLocationLng: "",
    dropoffLocationAddress: "",
    routePolyline: "",
    numberOfPassengers: 0,
    phone: "",
    routeDistanceKm: 0,
}

export const useRideRequestStore = create<RideRequestState>()(
    persist(
        (set, get) => ({
            ...defaultState,

            setRideRequestDetails: (rideRequestDetails: Partial<RideRequestData>) => {
                set(() => ({
                    ...rideRequestDetails
                }))
            },

            clearRideRequestDetails: () => set(() => ({...defaultState})),

            isEmpty: () => {
                const {id, pickupLocationAddress, dropoffLocationAddress} = get();
                return id === 0 || pickupLocationAddress === "" || dropoffLocationAddress === "";
            },
        }),
        {
            name: 'ride-request-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)