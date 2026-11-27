export interface CreateBookingDetails {
    deviationKm: number
}

export interface CreateBookingResponse {
    id: number,
    status: string,
    createdAt: string,
}

export interface GetBookingsResponse {
    rideId?: number,
    rideRequestId: number,
    bookingId: number,
    status?: string,
    deviationKm?: number,
    acceptedAt?: string,
    rideRequesterUsername: string,
    rideRequesterAvatar: string,
    rideRequesterEmail: string,
    rideRequesterPhone: string,
    pickupLocationLat: number,
    pickupLocationLng: number,
    pickupLocationAddress: string,
    dropoffLocationLat: number,
    dropoffLocationLng: number,
    dropoffLocationAddress: string,
    numberOfPassengers: number,
    routeDistanceKm: number
}

export interface GetBookingStatusResponse {
    id: number,
    status: string,
    rideStatus?: string,
    availableSeats?: number,
    acceptedAt?: string,
}
