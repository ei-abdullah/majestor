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
public class CreateBookingResponseDTO {
    private Long id;
    private String status;
    private Instant createdAt;
}
