package com.majestor.api.modules.carpool.rideRequest;

import com.majestor.api.modules.carpool.booking.Booking;
import com.majestor.api.modules.carpool.ride.Ride;
import com.majestor.api.modules.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ride_requests")
public class RideRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Pickup location lat is required")
    private String pickupLocationLat;

    @Column(nullable = false)
    @NotBlank(message = "Pickup location lng is required")
    private String pickupLocationLng;

    @Column(nullable = false)
    @NotBlank(message = "Pickup location address is required")
    private String pickupLocationAddress;

    @Column(nullable = false)
    @NotBlank(message = "DropOff location lat is required")
    private String dropoffLocationLat;

    @Column(nullable = false)
    @NotBlank(message = "DropOff location lng is required")
    private String dropoffLocationLng;

    @Column(nullable = false)
    @NotBlank(message = "Dropoff location address is required")
    private String dropoffLocationAddress;

    @Column(nullable = false)
    @NotBlank(message = "Route polyline is required")
    private String routePolyline;

    @Column(nullable = false)
    @NotNull(message = "Number of passengers are required")
    private Integer numberOfPassengers;

    @Column(nullable = false)
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @Column(nullable = false)
    @NotNull(message = "Route total distance is required")
    @PositiveOrZero(message = "Route total distance must be a positive number")
    private BigDecimal routeDistanceKm;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ride_requester_id", nullable = false)
    private User rideRequester;

    @OneToMany(mappedBy = "bookedRide")
    private List<Booking> bookedRides;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
