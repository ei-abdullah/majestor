package com.majestor.api.modules.carpool.booking;

import com.majestor.api.modules.carpool.ride.Ride;
import com.majestor.api.modules.carpool.rideRequest.RideRequest;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ride_id", nullable = false)
    private Ride ride;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booked_ride_request", nullable = false)
    private RideRequest bookedRide;

    @Column(nullable = false)
    @NotNull(message = "Deviation must be provided")
    @PositiveOrZero(message = "Deviation must be positive")
    private BigDecimal deviationKm;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.BOOKED;

    private Instant createdAt;
    private Instant updatedAt;
}
