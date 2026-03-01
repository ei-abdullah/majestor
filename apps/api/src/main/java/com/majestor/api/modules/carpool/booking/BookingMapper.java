package com.majestor.api.modules.carpool.booking;

import com.majestor.api.modules.carpool.booking.dto.CreateBookingResponseDTO;
import com.majestor.api.modules.carpool.booking.dto.GetBookingDTO;
import com.majestor.api.modules.carpool.rideRequest.RideRequest;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingMapper {

    private final Utils utils;

    // Maps a RideRequest to its detail DTO
    public GetBookingDTO toGetBookingDTO(Booking booking) {
        RideRequest bookedRide = booking.getBookedRide();
        User rideRequester = bookedRide.getRideRequester();
        String imageUri = utils.DownloadUserAvatar(rideRequester);
        return GetBookingDTO
                .builder()
                .bookingId(booking.getId())
                .rideRequestId(bookedRide.getId())
                .rideRequesterUsername(rideRequester.getUsername())
                .rideRequesterAvatar(imageUri)
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

    public CreateBookingResponseDTO toCreateBookingResponseDTO(Booking booking) {
        return CreateBookingResponseDTO
                .builder()
                .id(booking.getId())
                .status(booking.getStatus().name())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
