package com.majestor.api.modules.carpool.ride.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UploadRideDTO {
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

    @NotBlank(message = "Vehicle type is required")
    private String vehicleType;

    @NotBlank(message = "Vehicle modal is required")
    private String vehicleModal;

    @NotBlank(message = "License plate number is required")
    private String licensePlate;

    @NotBlank(message = "Route polyline is required")
    private String routePolyline;

    @NotNull(message = "Available seats is required")
    private Integer availableSeats;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @NotNull(message = "Route total distance is required")
    @PositiveOrZero(message = "Route total distance must be a positive number")
    private BigDecimal routeDistanceKm;
}
