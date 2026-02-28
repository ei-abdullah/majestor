package com.majestor.api.modules.carpool.rideRequest;

import com.majestor.api.modules.carpool.booking.Booking;
import com.majestor.api.modules.carpool.ride.Ride;
import com.majestor.api.modules.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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

    @Column(nullable = false, precision = 10, scale = 7)
    @NotNull(message = "Pickup location lat is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private BigDecimal pickupLocationLat;

    @Column(nullable = false, precision = 10, scale = 7)
    @NotNull(message = "Pickup location lng is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private BigDecimal pickupLocationLng;

    @Column(nullable = false)
    @NotBlank(message = "Pickup location address is required")
    private String pickupLocationAddress;

    @Column(nullable = false, precision = 10, scale = 7)
    @NotNull(message = "DropOff location lat is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private BigDecimal dropoffLocationLat;

    @Column(nullable = false, precision = 10, scale = 7)
    @NotNull(message = "DropOff location lng is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private BigDecimal dropoffLocationLng;

    @Column(nullable = false)
    @NotBlank(message = "Dropoff location address is required")
    private String dropoffLocationAddress;

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
