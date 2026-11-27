package com.majestor.api.modules.carpool.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;


public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.bookedRide br
            JOIN FETCH br.rideRequester
            WHERE b.ride.id = :rideId
            AND (b.status = 'ACCEPTED' OR (b.status = 'BOOKED' AND b.createdAt >= :cutoff))
            ORDER BY CASE WHEN b.status = 'ACCEPTED' THEN 0 ELSE 1 END, b.createdAt DESC
            """)
    List<Booking> findByRideId(
            @Param("rideId") Long rideId,
            @Param("cutoff") Instant cutoff
    );

    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.bookedRide br
            JOIN FETCH br.rideRequester
            WHERE b.ride.id = :rideId
            AND b.status IN ('BOOKED', 'ACCEPTED')
            """)
    List<Booking> findAllActiveByRideId(@Param("rideId") Long rideId);

    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.ride r
            JOIN FETCH r.ridePoster
            JOIN FETCH b.bookedRide br
            JOIN FETCH br.rideRequester
            WHERE br.id = :rideRequestId
            AND b.status IN ('BOOKED', 'ACCEPTED')
            """)
    List<Booking> findAllActiveByRideRequestId(@Param("rideRequestId") Long rideRequestId);

    @Query("""
            SELECT COUNT(b) > 0 FROM Booking b
            WHERE b.ride.id = :rideId
            AND b.bookedRide.id = :rideRequestId
            AND b.status IN ('BOOKED', 'ACCEPTED')
            """)
    boolean existsActiveByRideIdAndRideRequestId(
            @Param("rideId") Long rideId,
            @Param("rideRequestId") Long rideRequestId
    );

    @Query("""
            SELECT COUNT(b) FROM Booking b
            WHERE b.ride.id = :rideId
            AND b.status = 'ACCEPTED'
            """)
    long countAcceptedByRideId(@Param("rideId") Long rideId);

    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.ride r
            JOIN FETCH r.ridePoster
            JOIN FETCH b.bookedRide br
            JOIN FETCH br.rideRequester
            WHERE b.id = :bookingId
            """)
    Optional<Booking> findByIdWithDetails(@Param("bookingId") Long bookingId);
}
