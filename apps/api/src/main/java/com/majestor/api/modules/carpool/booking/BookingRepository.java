package com.majestor.api.modules.carpool.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
            SELECT b FROM Booking b
            JOIN FETCH b.bookedRide br
            WHERE b.ride.id = :rideId
            AND b.status = 'BOOKED'
            AND b.createdAt >= CURRENT_TIMESTAMP - 10 MINUTE
            ORDER BY b.createdAt DESC
            """)
    List<Booking> findByRideId(@Param("rideId") Long rideId);

}
