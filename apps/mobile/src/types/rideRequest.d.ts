export interface UploadRideRequestDetails {
    pickupLocationLat: number,
    pickupLocationLng: number,
    pickupLocationAddress: string,
    dropoffLocationLat: number,
    dropoffLocationLng: number,
    dropoffLocationAddress: string,
    numberOfPassengers: number,
    phone: string,
    routeDistanceKm: number
}

export interface UploadRideRequestResponse {
    id: number,
    pickupLocationLat: number,
    pickupLocationLng: number,
    pickupLocationAddress: string,
    dropoffLocationLat: number,
    dropoffLocationLng: number,
    dropoffLocationAddress: string,
    numberOfPassengers: number,
    phone: string,
    routeDistanceKm: number,
    createdAt: string,
}

export interface RideRequestData {
    id: number,
    pickupLocationLat: number,
    pickupLocationLng: number,
    pickupLocationAddress: string,
    dropoffLocationLat: number,
    dropoffLocationLng: number,
    dropoffLocationAddress: string,
    numberOfPassengers: number,
    phone: string,
    routeDistanceKm: number,
}

export interface RideRequestState extends RideRequestData {
    setRideRequestDetails: (rideRequestDetails: Partial<RideRequestData>) => void;
    clearRideRequestDetails: () => void;
    isEmpty: () => boolean;
}