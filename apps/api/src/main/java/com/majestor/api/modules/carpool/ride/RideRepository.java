package com.majestor.api.modules.carpool.ride;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface RideRepository extends JpaRepository<Ride, Long> {

    @Query("""
            SELECT r FROM Ride r
            JOIN FETCH r.ridePoster
            WHERE r.createdAt >= :createdAtAfter
            """)
    List<Ride> findByCreatedAtAfter(@Param("createdAtAfter") Instant createdAtAfter);

    @Query("""
            SELECT r FROM Ride r
            JOIN FETCH r.ridePoster
            WHERE r.id = :rideId
            """)
    Optional<Ride> findByIdWithPoster(@Param("rideId") Long rideId);

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
