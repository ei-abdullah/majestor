export interface CreateBookingDetails {
    deviationKm: number
}

export interface CreateBookingResponse {
    id: number,
    status: string,
    createdAt: string,
}

export interface GetBookingsResponse {
    rideRequestId: number,
    bookingId: number,
    rideRequesterUsername: string,
    rideRequesterAvatar: string,
    rideRequesterEmail: string,
    rideRequesterPhone: string,
    pickupLocationLat: string,
    pickupLocationLng: string,
    pickupLocationAddress: string,
    dropoffLocationLat: string,
    dropoffLocationLng: string,
    dropoffLocationAddress: string,
    numberOfPassengers: number,
    routeDistanceKm: number
}

export interface GetBookingStatusResponse {
    id: number,
    status: string,
}