package com.majestor.api.modules.carpool.fare;

import com.majestor.api.modules.carpool.ride.VehicleType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FareConfigRepository extends JpaRepository<FareConfig, Long> {
    Optional<FareConfig> findByVehicleType(VehicleType vehicleType);
    boolean existsByVehicleType(VehicleType vehicleType);
}