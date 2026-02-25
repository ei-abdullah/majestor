package com.majestor.api.modules.carpool.booking.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateBookingDTO {
    @NotNull(message = "Deviation KM is required")
    @PositiveOrZero(message = "Deviation KM must be zero or positive")
    private BigDecimal deviationKm;
}

