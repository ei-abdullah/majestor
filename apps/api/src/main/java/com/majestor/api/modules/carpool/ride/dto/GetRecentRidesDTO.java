package com.majestor.api.modules.carpool.ride.dto;

import com.majestor.api.modules.carpool.ride.VehicleType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetRecentRidesDTO {

    @NotBlank(message = "Start location lat is required")
    private String startLocationLat;

    @NotBlank(message = "Start location lng is required")
    private String startLocationLng;

    @NotBlank(message = "Start location address is required")
    private String startLocationAddress;

    @NotBlank(message = "End location lat is required")
    private String endLocationLat;

    @NotBlank(message = "End location lng is required")
    private String endLocationLng;

    @NotBlank(message = "End location address is required")
    private String endLocationAddress;

    @NotBlank(message = "Vehicle modal is required")
    private String vehicleModal;

    @NotBlank(message = "License plate is required")
    private String licensePlate;

    @NotBlank(message = "Route polyline is required")
    private String routePolyline;

    @NotNull(message = "Available seats are required")
    private Integer availableSeats;

    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotNull(message = "Route total distance is required")
    @PositiveOrZero(message = "Route total distance must be a positive number")
    private BigDecimal routeDistanceKm;

    @NotBlank(message = "Ride poster avatar is required")
    private String ridePosterImageUrl;

    @NotBlank(message = "Ride poster username is required")
    private String ridePosterUsername;

    @NotBlank(message = "Ride poster's email is required")
    private String ridePosterEmail;

    @NotNull(message = "Ride creation date is required")
    private LocalDateTime createdAt;
}
