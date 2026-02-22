export interface UploadRideRequestDetails {
    pickupLocationLat: string,
    pickupLocationLng: string,
    pickupLocationAddress: string,
    dropoffLocationLat: string,
    dropoffLocationLng: string,
    dropoffLocationAddress: string,
    routePolyline: string,
    numberOfPassengers: number,
    phone: string,
    routeDistanceKm: number
}

export interface UploadRideRequestResponse {
    id: number,
    pickupLocationLat: string,
    pickupLocationLng: string,
    pickupLocationAddress: string,
    dropoffLocationLat: string,
    dropoffLocationLng: string,
    dropoffLocationAddress: string,
    routePolyline: string,
    numberOfPassengers: number,
    phone: string,
    routeDistanceKm: number,
    createdAt: string,
}

export interface RideRequestData {
    id: number,
    pickupLocationLat: string,
    pickupLocationLng: string,
    pickupLocationAddress: string,
    dropoffLocationLat: string,
    dropoffLocationLng: string,
    dropoffLocationAddress: string,
    routePolyline: string,
    numberOfPassengers: number,
    phone: string,
    routeDistanceKm: number,
}

export interface RideRequestState extends RideRequestData {
    setRideRequestDetails: (rideRequestDetails: Partial<RideRequestData>) => void;
    clearRideRequestDetails: () => void;
    isEmpty: () => boolean;
}