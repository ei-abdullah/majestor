import {create} from "zustand";
import {LocationState} from "@/src/types/location";

export const useLocationStore = create<LocationState>((set) => ({
    destinationAddress: null,
    hasLocationPermission: false,

    setHasLocationPermission: (hasPermission: boolean) => {
        set(() => ({hasLocationPermission: hasPermission}))
    },

    userLatitude: null,
    userLongitude: null,
    userAddress: null,

    setUserLocation: ({ latitude, longitude, address }) => {
        set(() => ({ userLatitude: latitude, userLongitude: longitude, userAddress: address }))
    },

    clearLocation: () => {
        set(() => ({ userLatitude: null, userLongitude: null, userAddress: null }))
    }
}))