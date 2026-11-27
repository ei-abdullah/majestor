package com.majestor.api.modules.carpool.ride;

import com.majestor.api.infra.websocket.WebSocketService;
import com.majestor.api.modules.carpool.booking.Booking;
import com.majestor.api.modules.carpool.booking.BookingRepository;
import com.majestor.api.modules.carpool.booking.BookingStatus;
import com.majestor.api.modules.carpool.ride.dto.GetRecentRidesDTO;
import com.majestor.api.modules.carpool.rideRequest.RideRequest;
import com.majestor.api.modules.carpool.rideRequest.RideRequestRepository;
import com.majestor.api.modules.carpool.rideRequest.RideRequestStatus;
import com.majestor.api.modules.notification.NotificationService;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import com.majestor.api.modules.utils.Utils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RideServiceTest {

    @Mock
    private RideRepository rideRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private RideRequestRepository rideRequestRepository;
    @Spy
    private RideMapper rideMapper = new RideMapper(mock(Utils.class));
    @Mock
    private NotificationService notificationService;
    @Mock
    private WebSocketService webSocketService;

    @InjectMocks
    private RideService rideService;

    @Test
    void getRecentRides_filtersBySeatsAndSortsByProximity() {
        User driverFar = buildUser(1L, "DriverFar");
        User driverNear = buildUser(2L, "DriverNear");
        User driverFull = buildUser(3L, "DriverFull");

        // Passenger is at (33.6518, 73.1566) going to (33.7000, 73.0500), needs 2 seats
        Ride farRide = buildRide(1L, driverFar, 3, RideStatus.ACTIVE, 33.5500, 73.3000, 33.6000, 73.2000);
        Ride nearRide = buildRide(2L, driverNear, 2, RideStatus.ACTIVE, 33.6520, 73.1570, 33.7010, 73.0510);
        Ride insufficientSeatsRide = buildRide(3L, driverFull, 1, RideStatus.ACTIVE, 33.6518, 73.1566, 33.7000, 73.0500);

        when(rideRepository.findByCreatedAtAfter(any())).thenReturn(List.of(farRide, nearRide, insufficientSeatsRide));

        List<GetRecentRidesDTO> results = rideService.getRecentRides(
                33.6518, 73.1566,
                33.7000, 73.0500,
                2,
                99L
        );

        // insufficientSeatsRide (1 seat < 2 requested) is filtered out; nearRide comes before farRide
        assertThat(results).hasSize(2);
        assertThat(results.get(0).getId()).isEqualTo(2L);
        assertThat(results.get(0).getPickupDistanceKm()).isNotNull();
        assertThat(results.get(0).getEstimatedDetourKm()).isNotNull();
        assertThat(results.get(1).getId()).isEqualTo(1L);
    }

    @Test
    void cancelBookedRide_restoresSeatsWhenAcceptedBookingCancelled() {
        User driver = buildUser(1L, "Driver");
        User passenger = buildUser(2L, "Passenger");

        Ride ride = buildRide(10L, driver, 0, RideStatus.ACCEPTED, 33.65, 73.15, 33.70, 73.05);
        RideRequest rr = new RideRequest();
        rr.setId(20L);
        rr.setRideRequester(passenger);
        rr.setNumberOfPassengers(2);
        rr.setRideRequestStatus(RideRequestStatus.ACTIVE);

        Booking booking = new Booking();
        booking.setId(100L);
        booking.setRide(ride);
        booking.setBookedRide(rr);
        booking.setStatus(BookingStatus.ACCEPTED);

        when(rideRepository.findById(10L)).thenReturn(Optional.of(ride));
        when(bookingRepository.findByIdWithDetails(100L)).thenReturn(Optional.of(booking));
        when(bookingRepository.countAcceptedByRideId(10L)).thenReturn(0L);

        rideService.cancelBookedRide(10L, 100L, 2L);

        assertThat(booking.getStatus()).isEqualTo(BookingStatus.CANCELLED);
        assertThat(ride.getAvailableSeats()).isEqualTo(2);
        assertThat(ride.getRideStatus()).isEqualTo(RideStatus.ACTIVE);
    }

    @Test
    void cancelPostedRide_allowsDriverToCancelExpiredRide() {
        User driver = buildUser(1L, "Driver");
        Ride expiredRide = buildRide(10L, driver, 3, RideStatus.EXPIRED, 33.65, 73.15, 33.70, 73.05);
        expiredRide.setCreatedAt(Instant.now().minus(20, ChronoUnit.MINUTES));

        when(rideRepository.findById(10L)).thenReturn(Optional.of(expiredRide));
        when(bookingRepository.findAllActiveByRideId(10L)).thenReturn(List.of());

        rideService.cancelPostedRide(10L, 1L);

        assertThat(expiredRide.getRideStatus()).isEqualTo(RideStatus.CANCELLED);
    }

    private User buildUser(Long id, String username) {
        User u = new User();
        u.setId(id);
        u.setUsername(username);
        u.setEmail(username.toLowerCase() + "@cust.pk");
        return u;
    }

    private Ride buildRide(
            Long id,
            User poster,
            int availableSeats,
            RideStatus status,
            double startLat,
            double startLng,
            double endLat,
            double endLng
    ) {
        Ride r = new Ride();
        r.setId(id);
        r.setRidePoster(poster);
        r.setAvailableSeats(availableSeats);
        r.setRideStatus(status);
        r.setStartLocationLat(BigDecimal.valueOf(startLat));
        r.setStartLocationLng(BigDecimal.valueOf(startLng));
        r.setStartLocationAddress("Start");
        r.setEndLocationLat(BigDecimal.valueOf(endLat));
        r.setEndLocationLng(BigDecimal.valueOf(endLng));
        r.setEndLocationAddress("End");
        r.setRouteDistanceKm(BigDecimal.valueOf(10.0));
        r.setCreatedAt(Instant.now());
        return r;
    }
}
