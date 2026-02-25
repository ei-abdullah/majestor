import {create} from "zustand/react";
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {RideRequestState, UploadRideRequestResponse} from "@/src/types/rideRequest";


const defaultState = {
    id: 0,
    pickupLocationLat: 0,
    pickupLocationLng: 0,
    pickupLocationAddress: "",
    dropoffLocationLat: 0,
    dropoffLocationLng: 0,
    dropoffLocationAddress: "",
    numberOfPassengers: 0,
    phone: "",
    routeDistanceKm: 0,
    createdAt: "",
    bookingId: undefined,
    bookingStatus: undefined,
}

export const useRideRequestStore = create<RideRequestState>()(
    persist(
        (set, get) => ({
            ...defaultState,

            setRideRequestDetails: (rideRequestDetails: UploadRideRequestResponse) => {
                set(() => ({...rideRequestDetails}))
            },

            setBookingDetails: (bookingId: number, bookingStatus: string) => {
                set(() => ({bookingId, bookingStatus}))
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