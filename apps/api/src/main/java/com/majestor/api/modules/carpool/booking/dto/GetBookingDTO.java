package com.majestor.api.modules.carpool.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetBookingDTO {
    private Long rideId;
    private Long rideRequestId;
    private Long bookingId;
    private String status;
    private BigDecimal deviationKm;
    private Instant acceptedAt;
    private String rideRequesterUsername;
    private String rideRequesterAvatar;
    private String rideRequesterEmail;
    private String rideRequesterPhone;
    private BigDecimal pickupLocationLat;
    private BigDecimal pickupLocationLng;
    private String pickupLocationAddress;
    private BigDecimal dropoffLocationLat;
    private BigDecimal dropoffLocationLng;
    private String dropoffLocationAddress;
    private Integer numberOfPassengers;
    private BigDecimal routeDistanceKm;
}
