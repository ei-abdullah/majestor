package com.majestor.api.modules.carpool.ride.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class UploadRideResponseDTO {
    @NotNull(message = "Ride id is required")
    private Long id;

    @NotBlank(message = "Rider's phone is required")
    private String phone;

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

    @NotBlank(message = "Vehicle license plate is required")
    private String licensePlate;

    private String routePolyline;

    @NotNull(message = "Available seats are required")
    private Integer availableSeats;

    @NotNull(message = "Total route distance is required")
    private BigDecimal routeDistanceKm;

    @NotNull(message = "Time of creation is required")
    private LocalDateTime createdAt;
}
