package com.majestor.api.modules.carpool.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetBookingStatusResponseDTO {
    private Long id;
    private String status;
    private String rideStatus;
    private Integer availableSeats;
    private Instant acceptedAt;
}
