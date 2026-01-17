import {create} from "zustand";

interface LocationState {
    userLatitude: number | null;
    userLongitude: number | null;
    userAddress: string | null;
    destinationLongitude: number | null;
    destinationLatitude: number | null;
    destinationAddress: string | null;
    setUserLocation: (params: { latitude: number, longitude: number, address: string }) => void;
    setDestinationLocation: (params: { latitude: number, longitude: number, address: string }) => void;
}

interface DriverState {
    drivers: any[];
    selectedDriver: number | null;
    setSelectedDriver: (driverId: number) => void;
    setDrivers: (drivers: any[]) => void;
    clearSelectedDriver: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
    userLatitude: null,
    userLongitude: null,
    userAddress: null,
    destinationLongitude: null,
    destinationLatitude: null,
    destinationAddress: null,

    setUserLocation: ({latitude, longitude, address}) => {
        set(() => ({
            userLatitude: latitude,
            userLongitude: longitude,
            userAddress: address
        }))
    },
    setDestinationLocation: ({latitude, longitude, address}) => {
        set(() => ({
            destinationLatitude: latitude,
            destinationLongitude: longitude,
            destinationAddress: address
        }))
    }
}))

export const useDriverStore = create<DriverState>((set) => ({
    drivers: [],
    selectedDriver: null,
    setSelectedDriver: (driverId: number) => set(() => ({selectedDriver: driverId})),
    setDrivers: (drivers: any[]) => set(() => ({drivers: drivers})),
    clearSelectedDriver: () => set(() => ({selectedDriver: null}))
}))