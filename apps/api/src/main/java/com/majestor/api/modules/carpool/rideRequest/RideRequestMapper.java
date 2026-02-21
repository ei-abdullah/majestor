package com.majestor.api.modules.carpool.rideRequest;

import com.majestor.api.modules.carpool.rideRequest.dto.UploadRideRequestDTO;
import com.majestor.api.modules.carpool.rideRequest.dto.UploadRideRequestResponseDTO;
import com.majestor.api.modules.user.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class RideRequestMapper {

    public RideRequest toRideRequest(
            UploadRideRequestDTO uploadRideRequestDTO,
            User user
    ) {
        return RideRequest
                .builder()
                .pickupLocationLat(uploadRideRequestDTO.getPickupLocationLat())
                .pickupLocationLng(uploadRideRequestDTO.getPickupLocationLng())
                .pickupLocationAddress(uploadRideRequestDTO.getPickupLocationAddress())
                .dropoffLocationLat(uploadRideRequestDTO.getDropoffLocationLat())
                .dropoffLocationLng(uploadRideRequestDTO.getDropoffLocationLng())
                .dropoffLocationAddress(uploadRideRequestDTO.getDropoffLocationAddress())
                .routePolyline(uploadRideRequestDTO.getRoutePolyline())
                .numberOfPassengers(uploadRideRequestDTO.getNumberOfPassengers())
                .routeDistanceKm(uploadRideRequestDTO.getRouteDistanceKm())
                .phone(uploadRideRequestDTO.getPhone())
                .rideRequester(user)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public UploadRideRequestResponseDTO toUploadRideRequestResponseDTO(RideRequest rideRequest) {
        return UploadRideRequestResponseDTO
                .builder()
                .id(rideRequest.getId())
                .pickupLocationLat(rideRequest.getPickupLocationLat())
                .pickupLocationLng(rideRequest.getPickupLocationLng())
                .pickupLocationAddress(rideRequest.getPickupLocationAddress())
                .dropoffLocationLat(rideRequest.getDropoffLocationLat())
                .dropoffLocationLng(rideRequest.getDropoffLocationLng())
                .dropoffLocationAddress(rideRequest.getDropoffLocationAddress())
                .routePolyline(rideRequest.getRoutePolyline())
                .numberOfPassengers(rideRequest.getNumberOfPassengers())
                .phone(rideRequest.getPhone())
                .routeDistanceKm(rideRequest.getRouteDistanceKm())
                .createdAt(rideRequest.getCreatedAt())
                .build();
    }
}
