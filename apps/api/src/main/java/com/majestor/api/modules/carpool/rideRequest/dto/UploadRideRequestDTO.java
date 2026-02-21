package com.majestor.api.modules.carpool.rideRequest.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UploadRideRequestDTO {
    @NotBlank(message = "Pickup location lat is required")
    private String pickupLocationLat;

    @NotBlank(message = "Pickup location lng is required")
    private String pickupLocationLng;

    @NotBlank(message = "Pickup location address is required")
    private String pickupLocationAddress;

    @NotBlank(message = "Dropoff location lat is required")
    private String dropoffLocationLat;

    @NotBlank(message = "Dropoff location lng is required")
    private String dropoffLocationLng;

    @NotBlank(message = "Dropoff location address is required")
    private String dropoffLocationAddress;

    @NotBlank(message = "Route polyline is required")
    private String routePolyline;

    @NotNull(message = "Number of passengers are required")
    private Integer numberOfPassengers;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @NotNull(message = "Route total distance is required")
    @PositiveOrZero(message = "Route total distance must be a positive number")
    private BigDecimal routeDistanceKm;
}
