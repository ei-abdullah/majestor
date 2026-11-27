package com.majestor.api.modules.carpool.policy;

import com.majestor.api.infra.exception.ResourceNotFoundException;
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
import com.majestor.api.modules.notification.NotificationType;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class CarpoolPolicyService {

    private static final long NO_SHOW_GRACE_PERIOD_MINUTES = 10L;

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final RideRequestRepository rideRequestRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final WebSocketService webSocketService;

    @Transactional
    public void reportNoShow(Long bookingId, Long reporterId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new IllegalStateException("No-show can only be reported for an accepted booking");
        }

        Ride ride = booking.getRide();
        RideRequest rideRequest = booking.getBookedRide();
        User driver = ride.getRidePoster();
        User passenger = rideRequest.getRideRequester();

        boolean reportedByDriver;
        User offender;
        if (reporterId.equals(driver.getId())) {
            reportedByDriver = true;
            offender = passenger;
        } else if (reporterId.equals(passenger.getId())) {
            reportedByDriver = false;
            offender = driver;
        } else {
            throw new IllegalArgumentException("Reporter is not a party to this booking");
        }

        // Enforce the 10-minute grace period after booking acceptance (Section 7.4 of Terms of Service)
        Instant acceptedTime = booking.getAcceptedAt() != null ? booking.getAcceptedAt() : booking.getUpdatedAt();
        if (acceptedTime != null) {
            Instant gracePeriodEnd = acceptedTime.plus(NO_SHOW_GRACE_PERIOD_MINUTES, ChronoUnit.MINUTES);
            Instant now = Instant.now();
            if (now.isBefore(gracePeriodEnd)) {
                long remainingMinutes = Math.max(1L, (Duration.between(now, gracePeriodEnd).getSeconds() + 59) / 60);
                throw new IllegalStateException(
                        "Grace period active: Please wait " + remainingMinutes + " more minute"
                                + (remainingMinutes == 1 ? "" : "s")
                                + " (10 minutes after acceptance) before reporting a no-show."
                );
            }
        }

        Instant now = Instant.now();
        booking.setStatus(BookingStatus.NO_SHOW);
        booking.setUpdatedAt(now);
        bookingRepository.save(booking);

        if (reportedByDriver) {
            // Passenger no-showed: cancel passenger's ride request and restore seats to the driver's ride
            rideRequest.setRideRequestStatus(RideRequestStatus.CANCELLED);
            rideRequest.setUpdatedAt(now);
            rideRequestRepository.save(rideRequest);

            ride.setAvailableSeats(ride.getAvailableSeats() + rideRequest.getNumberOfPassengers());
            long remainingAccepted = bookingRepository.countAcceptedByRideId(ride.getId());
            boolean withinWindow = ride.getCreatedAt() != null
                    && !ride.getCreatedAt().isBefore(now.minus(10, ChronoUnit.MINUTES));

            if (withinWindow) {
                ride.setRideStatus(RideStatus.ACTIVE);
            } else if (remainingAccepted == 0) {
                ride.setRideStatus(RideStatus.CANCELLED);
            }
            ride.setUpdatedAt(now);
            rideRepository.save(ride);
        } else {
            // Driver no-showed: cancel the driver's ride and cancel any other active bookings on it
            ride.setRideStatus(RideStatus.CANCELLED);
            ride.setUpdatedAt(now);
            rideRepository.save(ride);

            List<Booking> otherActiveBookings = bookingRepository.findAllActiveByRideId(ride.getId());
            for (Booking other : otherActiveBookings) {
                if (!other.getId().equals(bookingId)) {
                    other.setStatus(BookingStatus.CANCELLED);
                    other.setUpdatedAt(now);
                    webSocketService.sendMessage("/topic/booking-status/" + other.getId(), "STATUS_UPDATED");
                }
            }
            if (!otherActiveBookings.isEmpty()) {
                bookingRepository.saveAll(otherActiveBookings);
            }
        }

        webSocketService.sendMessage("/topic/booking-status/" + bookingId, "STATUS_UPDATED");
        webSocketService.sendMessage("/topic/ride-requests/" + ride.getId(), "BOOKING_UPDATED");
        webSocketService.sendMessage("/topic/available-rides", "RIDE_UPDATED");

        applyStrike(offender, ride.getId());
    }

    /**
     * Enforces the Three-Strike System from Section 7.5 of the Terms of Service:
     * - 1st strike: Warning notification
     * - 2nd strike: Carpool feature suspended for 7 days
     * - 3rd strike: Permanent suspension from the carpool feature (strikes do not expire automatically)
     */
    private void applyStrike(User offender, Long rideId) {
        int strikes = (offender.getCarpoolStrikeCount() != null ? offender.getCarpoolStrikeCount() : 0) + 1;
        offender.setCarpoolStrikeCount(strikes);

        if (strikes == 1) {
            notificationService.sendNotification(
                    offender, null, NotificationType.CARPOOL_STRIKE,
                    "Carpool Warning (Strike 1 of 3)",
                    "You have received a warning for a no-show. A 2nd strike will result in a 7-day carpool suspension.",
                    rideId
            );
        } else if (strikes == 2) {
            offender.setCarpoolSuspendedUntil(Instant.now().plus(7, ChronoUnit.DAYS));
            notificationService.sendNotification(
                    offender, null, NotificationType.CARPOOL_SUSPENDED,
                    "Carpool Suspended (7 Days — Strike 2 of 3)",
                    "Your carpool access has been suspended for 7 days due to a second no-show. A 3rd strike results in permanent suspension.",
                    rideId
            );
        } else {
            // Permanent suspension (100 years)
            offender.setCarpoolSuspendedUntil(Instant.now().plus(36500, ChronoUnit.DAYS));
            notificationService.sendNotification(
                    offender, null, NotificationType.CARPOOL_SUSPENDED,
                    "Carpool Permanently Suspended (Strike 3 of 3)",
                    "Your carpool access has been permanently suspended due to a third policy violation.",
                    rideId
            );
        }

        userRepository.save(offender);
    }
}
