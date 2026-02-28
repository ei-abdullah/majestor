import {create} from "zustand/react"
import {createJSONStorage, persist} from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {RideState, UploadRideResponse} from "@/src/types/ride";


const defaultState = {
    id: 0,
    phone: "",
    startLocationLat: 0,
    startLocationLng: 0,
    startLocationAddress: "",
    endLocationLat: 0,
    endLocationLng: 0,
    endLocationAddress: "",
    vehicleType: "",
    vehicleModal: "",
    licensePlate: "",
    availableSeats: 0,
    routeDistanceKm: 0,
    createdAt: "",
    bookingId: undefined,
    bookingStatus: undefined,
};

export const useRideStore = create<RideState>()(
    persist(
        (set, get) => ({
            ...defaultState,

            setRideDetails: (rideDetails: UploadRideResponse) => {
                set(() => ({...rideDetails}))
            },

            clearRideDetails: () => set(() => ({...defaultState})),

            setAcceptedBooking: (bookingId: number, bookingStatus: string) => {
                set(() => ({bookingId, bookingStatus}))
            },

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