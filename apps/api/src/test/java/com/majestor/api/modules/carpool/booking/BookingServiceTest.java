package com.majestor.api.modules.carpool.booking;

import com.majestor.api.infra.websocket.WebSocketService;
import com.majestor.api.modules.carpool.booking.dto.CreateBookingDTO;
import com.majestor.api.modules.carpool.ride.Ride;
import com.majestor.api.modules.carpool.ride.RideRepository;
import com.majestor.api.modules.carpool.ride.RideStatus;
import com.majestor.api.modules.carpool.rideRequest.RideRequest;
import com.majestor.api.modules.carpool.rideRequest.RideRequestRepository;
import com.majestor.api.modules.carpool.rideRequest.RideRequestStatus;
import com.majestor.api.modules.notification.NotificationService;
import com.majestor.api.modules.user.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;
    @Mock
    private RideRepository rideRepository;
    @Mock
    private RideRequestRepository rideRequestRepository;
    @Mock
    private BookingMapper bookingMapper;
    @Mock
    private WebSocketService webSocketService;
    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private BookingService bookingService;

    @Test
    void createBooking_throwsWhenNotEnoughSeats() {
        User driver = buildUser(1L, "Driver");
        User passenger = buildUser(2L, "Passenger");
        Ride ride = buildRide(10L, driver, 2, RideStatus.ACTIVE);
        RideRequest rideRequest = buildRideRequest(20L, passenger, 3);

        when(rideRequestRepository.findById(20L)).thenReturn(Optional.of(rideRequest));
        when(rideRepository.findById(10L)).thenReturn(Optional.of(ride));

        CreateBookingDTO dto = new CreateBookingDTO();
        dto.setDeviationKm(BigDecimal.valueOf(1.5));

        assertThatThrownBy(() -> bookingService.createBooking(20L, 10L, dto, 2L))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Not enough available seats");
    }

    @Test
    void acceptBooking_decrementsSeatsAndKeepsRideActiveAndOnlyAutoRejectsOversizedRequests() {
        User driver = buildUser(1L, "Driver");
        User passenger1 = buildUser(2L, "Passenger1");
        User passenger2 = buildUser(3L, "Passenger2");
        User passenger3 = buildUser(4L, "Passenger3");

        // Ride starts with 3 available seats
        Ride ride = buildRide(10L, driver, 3, RideStatus.ACTIVE);

        // Passenger 1 wants 2 seats -> accepted -> 1 seat left
        RideRequest rr1 = buildRideRequest(21L, passenger1, 2);
        Booking b1 = buildBooking(101L, ride, rr1, BookingStatus.BOOKED);

        // Passenger 2 wants 1 seat -> fits in 1 remaining seat -> stays BOOKED
        RideRequest rr2 = buildRideRequest(22L, passenger2, 1);
        Booking b2 = buildBooking(102L, ride, rr2, BookingStatus.BOOKED);

        // Passenger 3 wants 2 seats -> exceeds 1 remaining seat -> auto-REJECTED
        RideRequest rr3 = buildRideRequest(23L, passenger3, 2);
        Booking b3 = buildBooking(103L, ride, rr3, BookingStatus.BOOKED);

        when(bookingRepository.findByIdWithDetails(101L)).thenReturn(Optional.of(b1));
        when(bookingRepository.findAllActiveByRideId(10L)).thenReturn(List.of(b1, b2, b3));

        bookingService.acceptBooking(101L, 1L);

        assertThat(b1.getStatus()).isEqualTo(BookingStatus.ACCEPTED);
        assertThat(b1.getAcceptedAt()).isNotNull();
        assertThat(ride.getAvailableSeats()).isEqualTo(1);
        assertThat(ride.getRideStatus()).isEqualTo(RideStatus.ACTIVE);

        // b2 still fits (1 seat <= 1 remaining seat)
        assertThat(b2.getStatus()).isEqualTo(BookingStatus.BOOKED);
        // b3 exceeds remaining seats (2 seats > 1 remaining seat)
        assertThat(b3.getStatus()).isEqualTo(BookingStatus.REJECTED);
    }

    @Test
    void acceptBooking_marksRideAcceptedWhenSeatsReachZero() {
        User driver = buildUser(1L, "Driver");
        User passenger1 = buildUser(2L, "Passenger1");

        Ride ride = buildRide(10L, driver, 2, RideStatus.ACTIVE);
        RideRequest rr1 = buildRideRequest(21L, passenger1, 2);
        Booking b1 = buildBooking(101L, ride, rr1, BookingStatus.BOOKED);

        when(bookingRepository.findByIdWithDetails(101L)).thenReturn(Optional.of(b1));
        when(bookingRepository.findAllActiveByRideId(10L)).thenReturn(List.of(b1));

        bookingService.acceptBooking(101L, 1L);

        assertThat(ride.getAvailableSeats()).isEqualTo(0);
        assertThat(ride.getRideStatus()).isEqualTo(RideStatus.ACCEPTED);
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

    private Booking buildBooking(Long id, Ride ride, RideRequest rr, BookingStatus status) {
        Booking b = new Booking();
        b.setId(id);
        b.setRide(ride);
        b.setBookedRide(rr);
        b.setStatus(status);
        b.setDeviationKm(BigDecimal.valueOf(1.0));
        return b;
    }
}
