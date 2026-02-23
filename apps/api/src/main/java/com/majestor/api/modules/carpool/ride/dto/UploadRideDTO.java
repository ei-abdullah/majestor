package com.majestor.api.modules.carpool.ride.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UploadRideDTO {
    @NotNull(message = "Start location lat is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private BigDecimal startLocationLat;

    @NotNull(message = "Start location lng is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
    @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
    private BigDecimal startLocationLng;

    @NotBlank(message = "Start location address is required")
    private String startLocationAddress;

    @NotNull(message = "End location lat is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private BigDecimal endLocationLat;

    @NotNull(message = "End location lng is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
    @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
    private BigDecimal endLocationLng;

    @NotBlank(message = "End location address is required")
    private String endLocationAddress;

    @NotBlank(message = "Vehicle type is required")
    private String vehicleType;

    @NotBlank(message = "Vehicle modal is required")
    private String vehicleModal;

    @NotBlank(message = "License plate number is required")
    private String licensePlate;

    @NotNull(message = "Available seats is required")
    private Integer availableSeats;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @NotNull(message = "Route total distance is required")
    @PositiveOrZero(message = "Route total distance must be a positive number")
    private BigDecimal routeDistanceKm;
}
