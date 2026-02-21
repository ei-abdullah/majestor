package com.majestor.api.modules.carpool.ride;

import com.majestor.api.modules.carpool.ride.dto.GetRecentRidesDTO;
import com.majestor.api.modules.carpool.ride.dto.UploadRideDTO;
import com.majestor.api.modules.carpool.ride.dto.UploadRideResponseDTO;
import com.majestor.api.modules.user.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class RideMapper {

    public Ride toRide(
            UploadRideDTO uploadRideDTO,
            User user
    ) {
        return Ride
                .builder()
                .startLocationLat(uploadRideDTO.getStartLocationLat())
                .startLocationLng(uploadRideDTO.getStartLocationLng())
                .startLocationAddress(uploadRideDTO.getStartLocationAddress())
                .endLocationLat(uploadRideDTO.getEndLocationLat())
                .endLocationLng(uploadRideDTO.getEndLocationLng())
                .endLocationAddress(uploadRideDTO.getEndLocationAddress())
                .vehicleModal(uploadRideDTO.getVehicleModal())
                .vehicleType(VehicleType.valueOf(uploadRideDTO.getVehicleType()))
                .licensePlate(uploadRideDTO.getLicensePlate())
                .routePolyline(uploadRideDTO.getRoutePolyline())
                .availableSeats(uploadRideDTO.getAvailableSeats())
                .phone(uploadRideDTO.getPhone())
                .routeDistanceKm(uploadRideDTO.getRouteDistanceKm())
                .ridePoster(user)
                .rideStatus(RideStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public UploadRideResponseDTO toUploadRideResponseDTO(Ride ride) {
        return UploadRideResponseDTO
                .builder()
                .id(ride.getId())
                .phone(ride.getPhone())
                .startLocationLat(ride.getStartLocationLat())
                .startLocationLng(ride.getStartLocationLng())
                .startLocationAddress(ride.getStartLocationAddress())
                .endLocationLat(ride.getEndLocationLat())
                .endLocationLng(ride.getEndLocationLng())
                .endLocationAddress(ride.getEndLocationAddress())
                .vehicleType(ride.getVehicleType().name())
                .vehicleModal(ride.getVehicleModal())
                .licensePlate(ride.getLicensePlate())
                .routePolyline(ride.getRoutePolyline())
                .availableSeats(ride.getAvailableSeats())
                .routeDistanceKm(ride.getRouteDistanceKm())
                .createdAt(ride.getCreatedAt())
                .build();
    }

    public List<GetRecentRidesDTO> getRecentRidesDTOS(
            List<Ride> rides
    ) {
        if (rides == null || rides.isEmpty()) return List.of();

        return rides
                .stream()
                .map(ride -> GetRecentRidesDTO
                        .builder()
                        .startLocationLat(ride.getStartLocationLat())
                        .startLocationLng(ride.getStartLocationLng())
                        .startLocationAddress(ride.getStartLocationAddress())
                        .endLocationLat(ride.getEndLocationLat())
                        .endLocationLng(ride.getEndLocationLng())
                        .endLocationAddress(ride.getEndLocationAddress())
                        .vehicleModal(ride.getVehicleModal())
                        .licensePlate(ride.getLicensePlate())
                        .routePolyline(ride.getRoutePolyline())
                        .availableSeats(ride.getAvailableSeats())
                        .vehicleType(ride.getVehicleType())
                        .phone(ride.getPhone())
                        .routeDistanceKm(ride.getRouteDistanceKm())
                        .ridePosterImageUrl(ride.getRidePoster().getAvatar())
                        .ridePosterUsername(ride.getRidePoster().getUsername())
                        .ridePosterEmail(ride.getRidePoster().getEmail())
                        .createdAt(ride.getCreatedAt())
                        .build()
                )
                .toList();
    }
}
