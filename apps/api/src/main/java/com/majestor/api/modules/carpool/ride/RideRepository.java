package com.majestor.api.modules.carpool.ride;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByCreatedAtAfter(LocalDateTime createdAtAfter);
}
