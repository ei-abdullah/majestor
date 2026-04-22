package com.majestor.api.modules.carpool.fare.dto;

public record FareConfigDTO(
        VehicleConfigDTO car,
        VehicleConfigDTO bike
) {
    public record VehicleConfigDTO(int pricePerKm) {}
}