package com.majestor.api.modules.carpool.booking.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingResponseDTO {
    private Long id;
    private String status;
    private LocalDateTime createdAt;
}
