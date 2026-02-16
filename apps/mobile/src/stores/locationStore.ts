import {create} from "zustand";

interface LocationState {
    userLatitude: number | null;
    userLongitude: number | null;
    userAddress: string | null;
    destinationLongitude: number | null;
    destinationLatitude: number | null;
    destinationAddress: string | null;
    hasLocationPermission: boolean;
    setUserLocation: (params: { latitude: number, longitude: number, address: string }) => void;
    setDestinationLocation: (params: { latitude: number, longitude: number, address: string }) => void;
    setHasLocationPermission: (hasPermission: boolean) => void;
    getUserLocationObject: () => { latitude: number; longitude: number; address: string } | null;
}

interface DriverState {
    drivers: any[];
    selectedDriver: number | null;
    setSelectedDriver: (driverId: number) => void;
    setDrivers: (drivers: any[]) => void;
    clearSelectedDriver: () => void;
}

export const useLocationStore = create<LocationState>((set, get) => ({
    userLatitude: null,
    userLongitude: null,
    userAddress: null,
    destinationLongitude: null,
    destinationLatitude: null,
    destinationAddress: null,
    hasLocationPermission: false,

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
    },
    setHasLocationPermission: (hasPermission: boolean) => {
        set(() => ({ hasLocationPermission: hasPermission }))
    },
    getUserLocationObject: () => {
        const state = get();
        if (state.userLatitude && state.userLongitude && state.userAddress) {
            return {
                latitude: state.userLatitude,
                longitude: state.userLongitude,
                address: state.userAddress
            };
        }
        return null;
    }
}))

export const useDriverStore = create<DriverState>((set) => ({
    drivers: [],
    selectedDriver: null,
    setSelectedDriver: (driverId: number) => set(() => ({selectedDriver: driverId})),
    setDrivers: (drivers: any[]) => set(() => ({drivers: drivers})),
    clearSelectedDriver: () => set(() => ({selectedDriver: null}))
}))