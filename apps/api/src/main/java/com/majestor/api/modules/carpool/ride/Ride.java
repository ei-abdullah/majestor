package com.majestor.api.modules.carpool.ride;

import com.majestor.api.modules.carpool.booking.Booking;
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
@Table(name = "rides")
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, precision = 10, scale = 7)
    @NotNull(message = "Start location lat is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private BigDecimal startLocationLat;

    @Column(nullable = false, precision = 10, scale = 7)
    @NotNull(message = "Start location lng is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
    @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
    private BigDecimal startLocationLng;

    @Column(nullable = false)
    @NotBlank(message = "Start location address is required")
    private String startLocationAddress;

    @Column(nullable = false, precision = 10, scale = 7)
    @NotNull(message = "End location lat is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be >= -90")
    @DecimalMax(value = "90.0", message = "Latitude must be <= 90")
    private BigDecimal endLocationLat;

    @Column(nullable = false, precision = 10, scale = 7)
    @NotNull(message = "End location lng is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be >= -180")
    @DecimalMax(value = "180.0", message = "Longitude must be <= 180")
    private BigDecimal endLocationLng;

    @Column(nullable = false)
    @NotBlank(message = "End location address is required")
    private String endLocationAddress;

    @Column(nullable = false)
    @NotBlank(message = "Vehicle modal is required")
    private String vehicleModal;

    @Column(nullable = false)
    @NotBlank(message = "License plate is required")
    private String licensePlate;

    @Column(nullable = false)
    @NotNull(message = "Available seats are required")
    private Integer availableSeats;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    @Enumerated(EnumType.STRING)
    private RideStatus rideStatus;

    @Column(nullable = false)
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @Column(nullable = false)
    @NotNull(message = "Route total distance is required")
    @PositiveOrZero(message = "Route total distance must be a positive number")
    private BigDecimal routeDistanceKm;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ride_poster_id", nullable = false)
    private User ridePoster;

    @OneToMany(mappedBy = "ride")
    private List<Booking> booking;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
