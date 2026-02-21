package com.majestor.api.modules.carpool.booking;

import com.majestor.api.modules.carpool.booking.dto.GetBookingDTO;
import com.majestor.api.modules.carpool.rideRequest.RideRequest;
import com.majestor.api.modules.user.User;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    // Maps a RideRequest to its detail DTO
    public GetBookingDTO toGetBookingDTO(Booking booking) {
        RideRequest bookedRide = booking.getBookedRide();
        User rideRequester = bookedRide.getRideRequester();
        return GetBookingDTO
                .builder()
                .bookingId(booking.getId())
                .rideRequestId(bookedRide.getId())
                .rideRequesterUsername(rideRequester.getUsername())
                .rideRequesterAvatar((rideRequester.getAvatar()))
                .rideRequesterEmail(rideRequester.getEmail())
                .rideRequesterPhone(bookedRide.getPhone())
                .pickupLocationLat(bookedRide.getPickupLocationLat())
                .pickupLocationLng(bookedRide.getPickupLocationLng())
                .pickupLocationAddress(bookedRide.getPickupLocationAddress())
                .dropoffLocationLat(bookedRide.getDropoffLocationLat())
                .dropoffLocationLng(bookedRide.getDropoffLocationLng())
                .dropoffLocationAddress(bookedRide.getDropoffLocationAddress())
                .numberOfPassengers(bookedRide.getNumberOfPassengers())
                .routeDistanceKm(bookedRide.getRouteDistanceKm())
                .build();
    }
}
