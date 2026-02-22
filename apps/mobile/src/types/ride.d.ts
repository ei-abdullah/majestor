export interface UploadRideDetails {
    startLocationLat: string,
    startLocationLng: string,
    startLocationAddress: string,
    endLocationLat: string,
    endLocationLng: string,
    endLocationAddress: string,
    vehicleType: string,
    vehicleModal: string,
    licensePlate: string,
    routePolyline: string,
    availableSeats: number,
    phone: string,
    routeDistanceKm: number
}

export interface UploadRideResponse {
    id: number,
    phone: string,
    startLocationLat: string,
    startLocationLng: string,
    startLocationAddress: string,
    endLocationLat: string,
    endLocationLng: string,
    endLocationAddress: string,
    vehicleType: string,
    vehicleModal: string,
    licensePlate: string,
    routePolyline: string,
    availableSeats: number,
    routeDistanceKm: number,
    createdAt: string
}

export interface RecentRideResponse {
    startLocationLat: string,
    startLocationLng: string,
    startLocationAddress: string,
    endLocationLat: string,
    endLocationLng: string,
    endLocationAddress: string,
    vehicleModal: string,
    licensePlate: string,
    routePolyline: string,
    availableSeats: 0,
    vehicleType: "CAR" | "BIKE",
    phone: string,
    routeDistanceKm: number,
    ridePosterImageUrl: string,
    ridePosterUsername: string,
    ridePosterEmail: string,
    createdAt: number
}

export interface RideData {
    id: number;
    phone: string;
    startLocationLat: string;
    startLocationLng: string;
    startLocationAddress: string;
    endLocationLat: string;
    endLocationLng: string;
    endLocationAddress: string;
    vehicleType: string;
    vehicleModal: string;
    licensePlate: string;
    routePolyline: string;
    availableSeats: number;
    routeDistanceKm: number;
    rideStatus: string;
}

export interface RideState extends RideData {
    setRideDetails: (rideDetails: RideData) => void;
    clearRideDetails: () => void;
    isEmpty: () => boolean;
}