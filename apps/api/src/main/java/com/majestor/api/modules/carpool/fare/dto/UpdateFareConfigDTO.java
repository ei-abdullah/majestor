package com.majestor.api.modules.carpool.fare.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateFareConfigDTO {

    @NotNull(message = "Price per km is required")
    @Positive(message = "Price per km must be positive")
    private Integer pricePerKm;
}