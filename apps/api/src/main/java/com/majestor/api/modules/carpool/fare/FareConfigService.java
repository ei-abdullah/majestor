package com.majestor.api.modules.carpool.fare;

import com.majestor.api.modules.carpool.fare.dto.FareConfigDTO;
import com.majestor.api.modules.carpool.fare.dto.UpdateFareConfigDTO;
import com.majestor.api.modules.carpool.ride.VehicleType;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FareConfigService {

    private final FareConfigRepository fareConfigRepository;

    @PostConstruct
    public void seedDefaults() {
        if (!fareConfigRepository.existsByVehicleType(VehicleType.CAR)) {
            fareConfigRepository.save(FareConfig.builder()
                    .vehicleType(VehicleType.CAR)
                    .pricePerKm(24)
                    .build());
        }
        if (!fareConfigRepository.existsByVehicleType(VehicleType.BIKE)) {
            fareConfigRepository.save(FareConfig.builder()
                    .vehicleType(VehicleType.BIKE)
                    .pricePerKm(13)
                    .build());
        }
    }

    public FareConfigDTO getFareConfig() {
        FareConfig car = fareConfigRepository.findByVehicleType(VehicleType.CAR)
                .orElseThrow(() -> new IllegalStateException("CAR fare config not found"));
        FareConfig bike = fareConfigRepository.findByVehicleType(VehicleType.BIKE)
                .orElseThrow(() -> new IllegalStateException("BIKE fare config not found"));

        return new FareConfigDTO(
                new FareConfigDTO.VehicleConfigDTO(car.getPricePerKm()),
                new FareConfigDTO.VehicleConfigDTO(bike.getPricePerKm())
        );
    }

    public FareConfigDTO updateFareConfig(VehicleType vehicleType, UpdateFareConfigDTO dto) {
        FareConfig config = fareConfigRepository.findByVehicleType(vehicleType)
                .orElseThrow(() -> new IllegalStateException(vehicleType + " fare config not found"));

        config.setPricePerKm(dto.getPricePerKm());
        fareConfigRepository.save(config);

        return getFareConfig();
    }
}
