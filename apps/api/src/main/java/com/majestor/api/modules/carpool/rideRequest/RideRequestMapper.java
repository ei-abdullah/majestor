package com.majestor.api.modules.carpool.rideRequest;

import com.majestor.api.modules.carpool.rideRequest.dto.UploadRideRequestDTO;
import com.majestor.api.modules.carpool.rideRequest.dto.UploadRideRequestResponseDTO;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Instant;


@Component
@RequiredArgsConstructor
public class RideRequestMapper {

    private final Utils utils;

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
                .numberOfPassengers(uploadRideRequestDTO.getNumberOfPassengers())
                .routeDistanceKm(uploadRideRequestDTO.getRouteDistanceKm())
                .phone(uploadRideRequestDTO.getPhone())
                .rideRequestStatus(RideRequestStatus.ACTIVE)
                .rideRequester(user)
                .createdAt(Instant.now())
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
                .numberOfPassengers(rideRequest.getNumberOfPassengers())
                .phone(rideRequest.getPhone())
                .routeDistanceKm(rideRequest.getRouteDistanceKm())
                .createdAt(rideRequest.getCreatedAt())
                .build();
    }
}
