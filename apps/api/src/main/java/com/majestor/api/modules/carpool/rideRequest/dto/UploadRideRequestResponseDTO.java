package com.majestor.api.modules.carpool.rideRequest.dto;

import jakarta.validation.constraints.*;
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
public class UploadRideRequestResponseDTO {
    @NotNull(message = "Ride request id is required")
    private Long id;

    @NotNull(message = "Pickup location lat is required")
    private BigDecimal pickupLocationLat;

    @NotBlank(message = "Pickup location lng is required")
    private BigDecimal pickupLocationLng;

    @NotBlank(message = "Pickup location address is required")
    private String pickupLocationAddress;

    @NotBlank(message = "DropOff location lat is required")
    private BigDecimal dropoffLocationLat;

    @NotBlank(message = "DropOff location lng is required")
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

    @NotNull(message = "Time of creation is required")
    private LocalDateTime createdAt;
}
