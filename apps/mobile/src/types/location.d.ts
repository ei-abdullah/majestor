export interface LocationState {
    // Permission
    hasLocationPermission: boolean;
    setHasLocationPermission: (hasPermission: boolean) => void;

    // User's current location
    userLatitude: number | null;
    userLongitude: number | null;
    userAddress: string | null;
    setUserLocation: (location: { latitude: number; longitude: number; address: string }) => void;
    clearLocation: () => void;
}
