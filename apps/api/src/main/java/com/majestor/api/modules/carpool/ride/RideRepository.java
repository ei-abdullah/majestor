package com.majestor.api.modules.carpool.ride;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByCreatedAtAfter(LocalDateTime createdAtAfter);

    @Modifying
    @Query("""
                UPDATE Ride r
                SET r.rideStatus = :newStatus
                WHERE r.createdAt < :cutoff
                AND r.rideStatus = :currentStatus
            """)
    void updateExpiredRides(
            @Param("cutoff") LocalDateTime cutoff,
            @Param("currentStatus") RideStatus currentStatus,
            @Param("newStatus") RideStatus newStatus
    );
}
