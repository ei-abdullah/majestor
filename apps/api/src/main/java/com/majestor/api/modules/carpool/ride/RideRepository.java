package com.majestor.api.modules.carpool.ride;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByCreatedAtAfter(Instant createdAtAfter);

    long countByRidePosterId(Long ridePosterId);

    long countByRidePosterIdAndRideStatus(Long ridePosterId, RideStatus rideStatus);

    @Query("SELECT r.createdAt FROM Ride r WHERE r.ridePoster.id = :userId AND r.createdAt >= :since")
    List<Instant> findCreatedAtByRidePosterId(@Param("userId") Long userId, @Param("since") Instant since);

    @Modifying
    @Query("""
                UPDATE Ride r
                SET r.rideStatus = :newStatus
                WHERE r.createdAt < :cutoff
                AND r.rideStatus = :currentStatus
            """)
    void updateExpiredRides(
            @Param("cutoff") Instant cutoff,
            @Param("currentStatus") RideStatus currentStatus,
            @Param("newStatus") RideStatus newStatus
    );
}
