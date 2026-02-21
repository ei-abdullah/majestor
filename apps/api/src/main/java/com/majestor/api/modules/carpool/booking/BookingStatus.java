package com.majestor.api.modules.carpool.booking;

public enum BookingStatus {
    BOOKED, // Ride booked by Ride requester
    ACCEPTED, // Ride accepted by Rider/Poster
    REJECTED, // Ride rejected by Rider/Poster
    CANCELLED // Ride canceled by booker/ride requester or rider
}
