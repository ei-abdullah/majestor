package com.majestor.api.modules.carpool.policy;

import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.infra.websocket.WebSocketService;
import com.majestor.api.modules.carpool.booking.Booking;
import com.majestor.api.modules.carpool.booking.BookingRepository;
import com.majestor.api.modules.carpool.booking.BookingStatus;
import com.majestor.api.modules.notification.NotificationService;
import com.majestor.api.modules.notification.NotificationType;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class CarpoolPolicyService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final WebSocketService webSocketService;

    @Transactional
    public void reportNoShow(Long bookingId, Long reporterId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new IllegalStateException("No-show can only be reported for an accepted booking");
        }

        User driver = booking.getRide().getRidePoster();
        User passenger = booking.getBookedRide().getRideRequester();

        User offender;
        if (reporterId.equals(driver.getId())) {
            offender = passenger;
        } else if (reporterId.equals(passenger.getId())) {
            offender = driver;
        } else {
            throw new IllegalArgumentException("Reporter is not a party to this booking");
        }

        try {
            booking.setStatus(BookingStatus.NO_SHOW);
            bookingRepository.save(booking);

            webSocketService.sendMessage("/topic/booking-status/" + bookingId, "STATUS_UPDATED");
        } catch (Exception e) {
            log.error("Failed to update booking status to NO_SHOW for bookingId: {}", bookingId, e);
            throw new RuntimeException("Failed to report no-show. Please try again later.");
        }

        applyStrike(offender, booking.getRide().getId());
    }

    private void applyStrike(User offender, Long rideId) {
        int strikes = offender.getCarpoolStrikeCount() + 1;
        offender.setCarpoolStrikeCount(strikes);

        if (strikes == 1) {
            notificationService.sendNotification(
                    offender, null, NotificationType.CARPOOL_STRIKE,
                    "Carpool Warning",
                    "You have received a warning for a no-show. Further violations will result in suspension.",
                    rideId
            );
        } else if (strikes == 2) {
            offender.setCarpoolSuspendedUntil(Instant.now().plus(1, ChronoUnit.DAYS));
            notificationService.sendNotification(
                    offender, null, NotificationType.CARPOOL_SUSPENDED,
                    "Carpool Suspended (1 Day)",
                    "Your carpool access has been suspended for 1 day due to a repeated no-show.",
                    rideId
            );
        } else {
            offender.setCarpoolSuspendedUntil(Instant.now().plus(3, ChronoUnit.DAYS));
            notificationService.sendNotification(
                    offender, null, NotificationType.CARPOOL_SUSPENDED,
                    "Carpool Suspended (3 Days)",
                    "Your carpool access has been suspended for 3 days due to repeated violations.",
                    rideId
            );
        }

        userRepository.save(offender);
    }

    @Scheduled(cron = "0 0 0 1 * *") // midnight on the 1st of every month
    @Transactional
    public void resetMonthlyStrikes() {
        userRepository.resetCarpoolStrikes(Instant.now());
        log.info("Monthly carpool strike counts reset at {}", Instant.now());
    }
}