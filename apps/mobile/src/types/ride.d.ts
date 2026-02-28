
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
    phone: string,
    routeDistanceKm: number,
    ridePosterImageUrl: string,
    ridePosterUsername: string,
    ridePosterEmail: string,
    createdAt: number
}


export interface RideState extends UploadRideResponse {
    bookingId?: number,
    bookingStatus?: string,
    bookerUsername?: string,
    bookerEmail?: string,
    bookerPhone?: string,
    bookerAvatar?: string,
    bookerPickupAddress?: string,
    bookerDropoffAddress?: string,
    bookerNumberOfPassengers?: number,
    bookerDeviationKm?: number,
    setRideDetails: (rideDetails: UploadRideResponse) => void;
    setAcceptedBooking: (bookingId: number, bookingStatus: string, booking: import("./booking").GetBookingsResponse) => void;
    clearRideDetails: () => void;
    isEmpty: () => boolean;
}