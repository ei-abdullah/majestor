package com.majestor.api.modules.carpool.rideRequest;

import com.majestor.api.infra.exception.AccessDeniedException;
import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.infra.websocket.WebSocketService;
import com.majestor.api.modules.carpool.booking.Booking;
import com.majestor.api.modules.carpool.booking.BookingRepository;
import com.majestor.api.modules.carpool.booking.BookingStatus;
import com.majestor.api.modules.carpool.ride.Ride;
import com.majestor.api.modules.carpool.ride.RideRepository;
import com.majestor.api.modules.carpool.ride.RideStatus;
import com.majestor.api.modules.carpool.rideRequest.dto.UploadRideRequestDTO;
import com.majestor.api.modules.carpool.rideRequest.dto.UploadRideRequestResponseDTO;
import com.majestor.api.modules.notification.NotificationService;
import com.majestor.api.modules.notification.NotificationType;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RideRequestService {

    private final UserRepository userRepository;
    private final RideRequestRepository rideRequestRepository;
    private final RideRequestMapper rideRequestMapper;
    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final WebSocketService webSocketService;
    private final NotificationService notificationService;

    @Transactional
    public UploadRideRequestResponseDTO uploadRideRequest(
            UploadRideRequestDTO uploadRideRequestDTO,
            Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (Boolean.TRUE.equals(user.isCarpoolSuspended())) {
            throw new IllegalStateException("Your carpool access is currently suspended");
        }

        RideRequest rideRequest = rideRequestMapper.toRideRequest(uploadRideRequestDTO, user);

        try {
            rideRequest = rideRequestRepository.save(rideRequest);
        } catch (Exception e) {
            log.error("Error while saving ride request: {}", e.getMessage());
            throw new RuntimeException("Failed to save ride request: " + e.getMessage(), e);
        }

        return rideRequestMapper.toUploadRideRequestResponseDTO(rideRequest);
    }

    @Transactional
    public void cancelRideRequest(Long rideRequestId, Long callerId) {
        RideRequest rideRequest = rideRequestRepository.findById(rideRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("RideRequest not found with id: " + rideRequestId));

        if (callerId != null && !rideRequest.getRideRequester().getId().equals(callerId)) {
            throw new AccessDeniedException("You are not authorized to cancel this ride request");
        }

        rideRequest.setRideRequestStatus(RideRequestStatus.CANCELLED);
        rideRequest.setUpdatedAt(Instant.now());
        rideRequestRepository.save(rideRequest);

        List<Booking> activeBookings = bookingRepository.findAllActiveByRideRequestId(rideRequestId);
        for (Booking booking : activeBookings) {
            BookingStatus previousStatus = booking.getStatus();
            booking.setStatus(BookingStatus.CANCELLED);
            booking.setUpdatedAt(Instant.now());

            Ride ride = booking.getRide();
            if (previousStatus == BookingStatus.ACCEPTED) {
                ride.setAvailableSeats(ride.getAvailableSeats() + rideRequest.getNumberOfPassengers());
                if (ride.getRideStatus() == RideStatus.ACCEPTED
                        && !ride.getCreatedAt().isBefore(Instant.now().minus(10, ChronoUnit.MINUTES))) {
                    ride.setRideStatus(RideStatus.ACTIVE);
                }
                ride.setUpdatedAt(Instant.now());
                rideRepository.save(ride);

                notificationService.sendNotification(
                        ride.getRidePoster(),
                        rideRequest.getRideRequester(),
                        NotificationType.RIDE_CANCELLED,
                        "Booking Cancelled",
                        rideRequest.getRideRequester().getUsername() + " cancelled their booking on your ride.",
                        ride.getId()
                );
            }

            webSocketService.sendMessage("/topic/booking-status/" + booking.getId(), "STATUS_UPDATED");
            webSocketService.sendMessage("/topic/ride-requests/" + ride.getId(), "BOOKING_UPDATED");
        }

        if (!activeBookings.isEmpty()) {
            bookingRepository.saveAll(activeBookings);
            webSocketService.sendMessage("/topic/available-rides", "RIDE_UPDATED");
        }
    }
}
