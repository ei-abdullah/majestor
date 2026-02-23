export interface UploadRideDetails {
    startLocationLat: number,
    startLocationLng: number,
    startLocationAddress: string,
    endLocationLat: number,
    endLocationLng: number,
    endLocationAddress: string,
    vehicleType: string,
    vehicleModal: string,
    licensePlate: string,
    availableSeats: number,
    phone: string,
    routeDistanceKm: number
}

export interface UploadRideResponse {
    id: number,
    phone: string,
    startLocationLat: number,
    startLocationLng: number,
    startLocationAddress: string,
    endLocationLat: number,
    endLocationLng: number,
    endLocationAddress: string,
    vehicleType: string,
    vehicleModal: string,
    licensePlate: string,
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
    availableSeats: 0,
    vehicleType: "CAR" | "BIKE",
    phone: string,
    routeDistanceKm: number,
    ridePosterImageUrl: string,
    ridePosterUsername: string,
    ridePosterEmail: string,
    createdAt: number
}


export interface RideState extends UploadRideResponse {
    setRideDetails: (rideDetails: UploadRideResponse) => void;
    clearRideDetails: () => void;
    isEmpty: () => boolean;
}