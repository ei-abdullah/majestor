import {create} from "zustand";

export const useLocationStore = create((set) => ({
    userLatitude: null,
    userLongitude: null,
    userAddress: null,
    destinationLongitude: null,
    destinationLatitude: null,
    destinationAddress: null,

    setUserLocation: ({latitude, longitude, address}: { latitude: number, longitude: number, address: string }) => {
        set(() => ({
            userLatitude: latitude,
            userLongitude: longitude,
            userAddress: address
        }))
    },
    setDestinationLocation: ({latitude, longitude, address}: {
        latitude: number,
        longitude: number,
        address: string
    }) => {
        set(() => ({
            destinationLatitude: latitude,
            destinationLongitude: longitude,
            destinationAddress: address
        }))
    }
}))

export const useDriverStore = create((set) => ({
    drivers: [],
    selectedDriver: null,
    setSelectedDriver: (driverId: number) => set(() => ({selectedDriver: driverId})),
    setDrivers: (drivers: number[]) => set(() => ({drivers: drivers})),
    clearSelectedDriver: () => set(() => ({selectedDriver: null}))
}))