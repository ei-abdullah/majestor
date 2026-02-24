package com.majestor.api.modules.carpool.rideRequest.dto;

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
public class UploadRideRequestDTO {
    @NotNull(message = "Pickup location lat is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private BigDecimal pickupLocationLat;

    @NotNull(message = "Pickup location lng is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private BigDecimal pickupLocationLng;

    @NotBlank(message = "Pickup location address is required")
    private String pickupLocationAddress;

    @NotNull(message = "DropOff location lat is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private BigDecimal dropoffLocationLat;

    @NotNull(message = "DropOff location lng is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private BigDecimal dropoffLocationLng;

    @NotBlank(message = "Dropoff location address is required")
    private String dropoffLocationAddress;

    @NotNull(message = "Number of passengers are required")
    private Integer numberOfPassengers;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @NotNull(message = "Route total distance is required")
    @PositiveOrZero(message = "Route total distance must be a positive number")
    private BigDecimal routeDistanceKm;
}
