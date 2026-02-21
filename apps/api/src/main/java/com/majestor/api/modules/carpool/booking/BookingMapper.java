package com.majestor.api.modules.carpool.booking;

import com.majestor.api.modules.carpool.booking.dto.GetBookingDTO;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    // Maps a RideRequest to its detail DTO
    public GetBookingDTO toGetBookingDTO(Booking booking) {
        return GetBookingDTO
                .builder()
                .bookingId(booking.getId())
                .rideRequestId(booking.getBookedRide().getId())
                .rideRequesterUsername(booking.getBookedRide().getRideRequester().getUsername())
                .rideRequesterAvatar((booking.getBookedRide().getRideRequester().getAvatar()))
                .rideRequesterEmail(booking.getBookedRide().getRideRequester().getEmail())
                .rideRequesterPhone(booking.getBookedRide().getPhone())
                .pickupLocationLat(booking.getBookedRide().getPickupLocationLat())
                .pickupLocationLng(booking.getBookedRide().getPickupLocationLng())
                .pickupLocationAddress(booking.getBookedRide().getPickupLocationAddress())
                .dropoffLocationLat(booking.getBookedRide().getDropoffLocationLat())
                .dropoffLocationLng(booking.getBookedRide().getDropoffLocationLng())
                .dropoffLocationAddress(booking.getBookedRide().getDropoffLocationAddress())
                .numberOfPassengers(booking.getBookedRide().getNumberOfPassengers())
                .routeDistanceKm(booking.getBookedRide().getRouteDistanceKm())
                .build();
    }
}
