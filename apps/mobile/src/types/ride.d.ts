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
    id: number,
    startLocationLat: number,
    startLocationLng: number,
    startLocationAddress: string,
    endLocationLat: number,
    endLocationLng: number,
    endLocationAddress: string,
    vehicleModal: string,
    licensePlate: string,
    availableSeats: number,
    vehicleType: "CAR" | "BIKE",
    rideStatus?: string,
    phone: string,
    routeDistanceKm: number,
    ridePosterImageUrl: string,
    ridePosterUsername: string,
    ridePosterEmail: string,
    isPosterElite?: boolean,
    pickupDistanceKm?: number,
    dropoffDistanceKm?: number,
    estimatedDetourKm?: number,
    createdAt: number | string
}


export interface RideState extends UploadRideResponse {
    bookingId?: number,
    bookingStatus?: string,
    setRideDetails: (rideDetails: UploadRideResponse) => void;
    setAcceptedBooking: (bookingId: number, bookingStatus: string) => void;
    clearAcceptedBooking: () => void;
    updateAvailableSeats: (availableSeats: number) => void;
    clearRideDetails: () => void;
    isEmpty: () => boolean;
}
