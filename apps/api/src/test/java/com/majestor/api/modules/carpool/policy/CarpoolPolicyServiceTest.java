package com.majestor.api.modules.carpool.policy;

import com.majestor.api.infra.websocket.WebSocketService;
import com.majestor.api.modules.carpool.booking.Booking;
import com.majestor.api.modules.carpool.booking.BookingRepository;
import com.majestor.api.modules.carpool.booking.BookingStatus;
import com.majestor.api.modules.carpool.ride.Ride;
import com.majestor.api.modules.carpool.ride.RideRepository;
import com.majestor.api.modules.carpool.ride.RideStatus;
import com.majestor.api.modules.carpool.rideRequest.RideRequest;
import com.majestor.api.modules.carpool.rideRequest.RideRequestRepository;
import com.majestor.api.modules.carpool.rideRequest.RideRequestStatus;
import com.majestor.api.modules.notification.NotificationService;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CarpoolPolicyServiceTest {

    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private RideRepository rideRepository;
    @Mock
    private RideRequestRepository rideRequestRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private NotificationService notificationService;
    @Mock
    private WebSocketService webSocketService;

    @InjectMocks
    private CarpoolPolicyService carpoolPolicyService;

    @Test
    void reportNoShow_throwsWhenWithin10MinuteGracePeriod() {
        User driver = buildUser(1L, "Driver");
        User passenger = buildUser(2L, "Passenger");
        Ride ride = buildRide(10L, driver, 0, RideStatus.ACCEPTED);
        RideRequest rideRequest = buildRideRequest(20L, passenger, 2);

        Booking booking = new Booking();
        booking.setId(100L);
        booking.setStatus(BookingStatus.ACCEPTED);
        booking.setAcceptedAt(Instant.now().minus(5, ChronoUnit.MINUTES));
        booking.setRide(ride);
        booking.setBookedRide(rideRequest);

        when(bookingRepository.findByIdWithDetails(100L)).thenReturn(Optional.of(booking));

        assertThatThrownBy(() -> carpoolPolicyService.reportNoShow(100L, 1L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Grace period active");

        verify(userRepository, never()).save(any());
    }

    @Test
    void reportNoShow_appliesFirstStrikeWarningAndRestoresSeats() {
        User driver = buildUser(1L, "Driver");
        User passenger = buildUser(2L, "Passenger");
        passenger.setCarpoolStrikeCount(0);

        Ride ride = buildRide(10L, driver, 0, RideStatus.ACCEPTED);
        RideRequest rideRequest = buildRideRequest(20L, passenger, 2);

        Booking booking = new Booking();
        booking.setId(100L);
        booking.setStatus(BookingStatus.ACCEPTED);
        booking.setAcceptedAt(Instant.now().minus(12, ChronoUnit.MINUTES));
        booking.setRide(ride);
        booking.setBookedRide(rideRequest);

        when(bookingRepository.findByIdWithDetails(100L)).thenReturn(Optional.of(booking));

        carpoolPolicyService.reportNoShow(100L, 1L);

        assertThat(booking.getStatus()).isEqualTo(BookingStatus.NO_SHOW);
        assertThat(rideRequest.getRideRequestStatus()).isEqualTo(RideRequestStatus.CANCELLED);
        assertThat(ride.getAvailableSeats()).isEqualTo(2);
        assertThat(ride.getRideStatus()).isEqualTo(RideStatus.ACTIVE);
        assertThat(passenger.getCarpoolStrikeCount()).isEqualTo(1);
        assertThat(passenger.getCarpoolSuspendedUntil()).isNull();
    }

    @Test
    void reportNoShow_appliesSecondStrikeSevenDaySuspension() {
        User driver = buildUser(1L, "Driver");
        User passenger = buildUser(2L, "Passenger");
        passenger.setCarpoolStrikeCount(1);

        Ride ride = buildRide(10L, driver, 1, RideStatus.ACTIVE);
        RideRequest rideRequest = buildRideRequest(20L, passenger, 1);

        Booking booking = new Booking();
        booking.setId(101L);
        booking.setStatus(BookingStatus.ACCEPTED);
        booking.setAcceptedAt(Instant.now().minus(15, ChronoUnit.MINUTES));
        booking.setRide(ride);
        booking.setBookedRide(rideRequest);

        when(bookingRepository.findByIdWithDetails(101L)).thenReturn(Optional.of(booking));

        carpoolPolicyService.reportNoShow(101L, 1L);

        assertThat(passenger.getCarpoolStrikeCount()).isEqualTo(2);
        assertThat(passenger.getCarpoolSuspendedUntil()).isAfter(Instant.now().plus(6, ChronoUnit.DAYS));
        assertThat(passenger.getCarpoolSuspendedUntil()).isBefore(Instant.now().plus(8, ChronoUnit.DAYS));
    }

    @Test
    void reportNoShow_appliesThirdStrikePermanentSuspension() {
        User driver = buildUser(1L, "Driver");
        User passenger = buildUser(2L, "Passenger");
        passenger.setCarpoolStrikeCount(2);

        Ride ride = buildRide(10L, driver, 1, RideStatus.ACTIVE);
        RideRequest rideRequest = buildRideRequest(20L, passenger, 1);

        Booking booking = new Booking();
        booking.setId(102L);
        booking.setStatus(BookingStatus.ACCEPTED);
        booking.setAcceptedAt(Instant.now().minus(15, ChronoUnit.MINUTES));
        booking.setRide(ride);
        booking.setBookedRide(rideRequest);

        when(bookingRepository.findByIdWithDetails(102L)).thenReturn(Optional.of(booking));

        carpoolPolicyService.reportNoShow(102L, 1L);

        assertThat(passenger.getCarpoolStrikeCount()).isEqualTo(3);
        assertThat(passenger.getCarpoolSuspendedUntil()).isAfter(Instant.now().plus(3650, ChronoUnit.DAYS));
    }

    private User buildUser(Long id, String username) {
        User u = new User();
        u.setId(id);
        u.setUsername(username);
        u.setEmail(username.toLowerCase() + "@cust.pk");
        return u;
    }

    private Ride buildRide(Long id, User poster, int availableSeats, RideStatus status) {
        Ride r = new Ride();
        r.setId(id);
        r.setRidePoster(poster);
        r.setAvailableSeats(availableSeats);
        r.setRideStatus(status);
        r.setCreatedAt(Instant.now());
        return r;
    }

    private RideRequest buildRideRequest(Long id, User requester, int passengers) {
        RideRequest rr = new RideRequest();
        rr.setId(id);
        rr.setRideRequester(requester);
        rr.setNumberOfPassengers(passengers);
        rr.setRideRequestStatus(RideRequestStatus.ACTIVE);
        return rr;
    }
}
