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
    bookerUsername: undefined,
    bookerEmail: undefined,
    bookerPhone: undefined,
    bookerAvatar: undefined,
    bookerPickupAddress: undefined,
    bookerDropoffAddress: undefined,
    bookerNumberOfPassengers: undefined,
    bookerDeviationKm: undefined,
};

export const useRideStore = create<RideState>()(
    persist(
        (set, get) => ({
            ...defaultState,

            setRideDetails: (rideDetails: UploadRideResponse) => {
                set(() => ({...rideDetails}))
            },

            clearRideDetails: () => set(() => ({...defaultState})),

            setAcceptedBooking: (bookingId: number, bookingStatus: string, booking) => {
                set(() => ({
                    bookingId,
                    bookingStatus,
                    bookerUsername: booking.rideRequesterUsername,
                    bookerEmail: booking.rideRequesterEmail,
                    bookerPhone: booking.rideRequesterPhone,
                    bookerAvatar: booking.rideRequesterAvatar,
                    bookerPickupAddress: booking.pickupLocationAddress,
                    bookerDropoffAddress: booking.dropoffLocationAddress,
                    bookerNumberOfPassengers: booking.numberOfPassengers,
                    bookerDeviationKm: Math.abs(booking.routeDistanceKm - get().routeDistanceKm),
                }))
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