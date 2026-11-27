package com.majestor.api.modules.carpool.ride;

import com.majestor.api.infra.exception.AccessDeniedException;
import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.infra.websocket.WebSocketService;
import com.majestor.api.modules.carpool.booking.Booking;
import com.majestor.api.modules.carpool.booking.BookingRepository;
import com.majestor.api.modules.carpool.booking.BookingStatus;
import com.majestor.api.modules.carpool.ride.dto.GetRecentRidesDTO;
import com.majestor.api.modules.carpool.ride.dto.UploadRideDTO;
import com.majestor.api.modules.carpool.ride.dto.UploadRideResponseDTO;
import com.majestor.api.modules.carpool.rideRequest.RideRequest;
import com.majestor.api.modules.carpool.rideRequest.RideRequestRepository;
import com.majestor.api.modules.carpool.rideRequest.RideRequestStatus;
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
import java.util.Comparator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RideService {

    private static final double EARTH_RADIUS_KM = 6371.0;

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final RideRequestRepository rideRequestRepository;
    private final BookingRepository bookingRepository;
    private final RideMapper rideMapper;
    private final WebSocketService webSocketService;
    private final NotificationService notificationService;

    @Transactional
    public UploadRideResponseDTO uploadRide(
            UploadRideDTO uploadRideDTO,
            Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (Boolean.TRUE.equals(user.isCarpoolSuspended())) {
            throw new IllegalStateException("Your carpool access is currently suspended");
        }

        Ride ride = rideMapper.toRide(uploadRideDTO, user);

        try {
            ride = rideRepository.save(ride);
            String topic = "/topic/available-rides";
            webSocketService.sendMessage(topic, "NEW_RIDE");
        } catch (Exception e) {
            log.error("Error while saving ride: {}", e.getMessage());
            throw new RuntimeException("Failed to save ride: " + e.getMessage(), e);
        }

        return rideMapper.toUploadRideResponseDTO(ride);
    }

    @Transactional(readOnly = true)
    public GetRecentRidesDTO getRideById(Long rideId) {
        Ride ride = rideRepository.findByIdWithPoster(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (ride.getRideStatus() == RideStatus.ACTIVE
                && ride.getCreatedAt() != null
                && ride.getCreatedAt().isBefore(Instant.now().minus(10, ChronoUnit.MINUTES))
                && bookingRepository.countAcceptedByRideId(rideId) == 0) {
            GetRecentRidesDTO dto = rideMapper.toGetRecentRideDTO(ride);
            dto.setRideStatus(RideStatus.EXPIRED.name());
            return dto;
        }

        return rideMapper.toGetRecentRideDTO(ride);
    }

    @Transactional(readOnly = true)
    public List<GetRecentRidesDTO> getRecentRides(
            Double pickupLat,
            Double pickupLng,
            Double dropoffLat,
            Double dropoffLng,
            Integer passengers,
            Long currentUserId
    ) {
        Instant cutoffTime = Instant.now().minus(10, ChronoUnit.MINUTES);

        List<Ride> recentRidesList;

        try {
            recentRidesList = rideRepository
                    .findByCreatedAtAfter(cutoffTime)
                    .stream()
                    .filter(ride -> ride.getRideStatus() == RideStatus.ACTIVE)
                    .filter(ride -> ride.getAvailableSeats() != null && ride.getAvailableSeats() > 0)
                    .filter(ride -> passengers == null || passengers <= 0 || ride.getAvailableSeats() >= passengers)
                    .filter(ride -> !Boolean.TRUE.equals(ride.getRidePoster().isCarpoolSuspended()))
                    .filter(ride -> currentUserId == null || !ride.getRidePoster().getId().equals(currentUserId))
                    .toList();
        } catch (Exception e) {
            log.error("Error while getting recent rides: {}", e.getMessage());
            throw new RuntimeException("Failed to get recent rides: " + e.getMessage(), e);
        }

        List<GetRecentRidesDTO> dtos = recentRidesList.stream()
                .map(ride -> {
                    GetRecentRidesDTO dto = rideMapper.toGetRecentRideDTO(ride);
                    if (pickupLat != null && pickupLng != null) {
                        double rStartLat = ride.getStartLocationLat().doubleValue();
                        double rStartLng = ride.getStartLocationLng().doubleValue();
                        double rEndLat = ride.getEndLocationLat().doubleValue();
                        double rEndLng = ride.getEndLocationLng().doubleValue();

                        double pickupDist = haversineKm(rStartLat, rStartLng, pickupLat, pickupLng);
                        dto.setPickupDistanceKm(round2(pickupDist));

                        if (dropoffLat != null && dropoffLng != null) {
                            double dropoffDist = haversineKm(dropoffLat, dropoffLng, rEndLat, rEndLng);
                            double passengerDirect = haversineKm(pickupLat, pickupLng, dropoffLat, dropoffLng);
                            double driverDirect = haversineKm(rStartLat, rStartLng, rEndLat, rEndLng);
                            double detour = Math.max(0.0, (pickupDist + passengerDirect + dropoffDist) - driverDirect);
                            dto.setDropoffDistanceKm(round2(dropoffDist));
                            dto.setEstimatedDetourKm(round2(detour));
                        } else {
                            dto.setDropoffDistanceKm(0.0);
                            dto.setEstimatedDetourKm(round2(pickupDist));
                        }
                    }
                    return dto;
                })
                .toList();

        if (pickupLat != null && pickupLng != null) {
            return dtos.stream()
                    .sorted(Comparator
                            .comparingDouble((GetRecentRidesDTO d) ->
                                    (d.getPickupDistanceKm() != null ? d.getPickupDistanceKm() : 0.0)
                                            + (d.getDropoffDistanceKm() != null ? d.getDropoffDistanceKm() : 0.0))
                            .thenComparing(d -> Boolean.TRUE.equals(d.getIsPosterElite()), Comparator.reverseOrder())
                            .thenComparing(GetRecentRidesDTO::getCreatedAt, Comparator.reverseOrder()))
                    .toList();
        }

        return dtos.stream()
                .sorted(Comparator
                        .comparing((GetRecentRidesDTO d) -> Boolean.TRUE.equals(d.getIsPosterElite()), Comparator.reverseOrder())
                        .thenComparing(GetRecentRidesDTO::getCreatedAt, Comparator.reverseOrder()))
                .toList();
    }

    public List<GetRecentRidesDTO> getRecentRides() {
        return getRecentRides(null, null, null, null, null, null);
    }

    public static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    private static double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    @Scheduled(fixedDelay = 2 * 60 * 60 * 1000) // sweeps every 2 hours; feed/booking already enforce the 10-min window
    @Transactional
    public void expireOldRides() {
        Instant cutoffTime = Instant.now().minus(10, ChronoUnit.MINUTES);
        try {
            rideRepository.updateExpiredRides(cutoffTime, RideStatus.ACTIVE, RideStatus.EXPIRED);
            log.info("Expired rides older than 10 minutes at {}", Instant.now());
        } catch (Exception e) {
            log.error("Error while expiring old rides: {}", e.getMessage());
        }
    }

    @Transactional
    public void completeRide(Long rideId, Long bookingId, Long callerId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getRide().getId().equals(rideId)) {
            throw new IllegalArgumentException("Booking does not belong to the specified ride");
        }

        if (callerId != null && !ride.getRidePoster().getId().equals(callerId)) {
            throw new AccessDeniedException("Only the driver can mark this ride booking as completed");
        }

        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new IllegalStateException("Only accepted bookings can be completed");
        }

        RideRequest rideRequest = booking.getBookedRide();

        booking.setStatus(BookingStatus.COMPLETED);
        booking.setUpdatedAt(Instant.now());
        rideRequest.setRideRequestStatus(RideRequestStatus.COMPLETED);
        rideRequest.setUpdatedAt(Instant.now());

        bookingRepository.save(booking);
        rideRequestRepository.save(rideRequest);

        // In multi-booking pooling, only mark the entire Ride COMPLETED when no other ACCEPTED bookings remain
        // and either all seats were filled or the 10-minute ride window has passed (or no pending requests remain).
        long remainingAccepted = bookingRepository.countAcceptedByRideId(rideId);
        List<Booking> remainingActive = bookingRepository.findAllActiveByRideId(rideId);
        boolean windowExpired = ride.getCreatedAt() != null
                && ride.getCreatedAt().isBefore(Instant.now().minus(10, ChronoUnit.MINUTES));

        if (remainingAccepted == 0 && (ride.getAvailableSeats() == 0 || windowExpired || remainingActive.isEmpty())) {
            ride.setRideStatus(RideStatus.COMPLETED);
            ride.setUpdatedAt(Instant.now());
            rideRepository.save(ride);
        }

        try {
            String topic = "/topic/booking-status/" + bookingId;
            webSocketService.sendMessage(topic, "STATUS_UPDATED");
            webSocketService.sendMessage("/topic/ride-requests/" + rideId, "BOOKING_UPDATED");

            notificationService.sendNotification(
                    rideRequest.getRideRequester(),
                    ride.getRidePoster(),
                    NotificationType.RIDE_COMPLETED,
                    "Ride Completed",
                    "Your ride with " + ride.getRidePoster().getUsername() + " has been completed.",
                    ride.getId()
            );
        } catch (Exception e) {
            log.error("Error while completing ride: {}", e.getMessage());
            throw new RuntimeException("Failed to complete ride: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void cancelBookedRide(Long rideId, Long bookingId, Long callerId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getRide().getId().equals(rideId)) {
            throw new IllegalArgumentException("Booking does not belong to the specified ride");
        }

        User driver = ride.getRidePoster();
        RideRequest rideRequest = booking.getBookedRide();
        User passenger = rideRequest.getRideRequester();

        if (callerId != null && !callerId.equals(driver.getId()) && !callerId.equals(passenger.getId())) {
            throw new AccessDeniedException("You are not a party to this booking");
        }

        if (booking.getStatus() != BookingStatus.ACCEPTED && booking.getStatus() != BookingStatus.BOOKED) {
            throw new IllegalStateException("This booking can no longer be cancelled");
        }

        BookingStatus previousStatus = booking.getStatus();
        boolean cancelledByDriver = callerId == null || callerId.equals(driver.getId());

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(Instant.now());
        bookingRepository.save(booking);

        if (previousStatus == BookingStatus.ACCEPTED) {
            rideRequest.setRideRequestStatus(RideRequestStatus.CANCELLED);
            rideRequest.setUpdatedAt(Instant.now());
            rideRequestRepository.save(rideRequest);

            // Restore seats freed by this cancelled booking
            ride.setAvailableSeats(ride.getAvailableSeats() + rideRequest.getNumberOfPassengers());
            boolean withinWindow = ride.getCreatedAt() != null
                    && !ride.getCreatedAt().isBefore(Instant.now().minus(10, ChronoUnit.MINUTES));
            long remainingAccepted = bookingRepository.countAcceptedByRideId(rideId);

            if (withinWindow) {
                ride.setRideStatus(RideStatus.ACTIVE);
            } else if (remainingAccepted == 0) {
                ride.setRideStatus(RideStatus.CANCELLED);
            }
            ride.setUpdatedAt(Instant.now());
            rideRepository.save(ride);
        }

        try {
            webSocketService.sendMessage("/topic/booking-status/" + bookingId, "STATUS_UPDATED");
            webSocketService.sendMessage("/topic/ride-requests/" + rideId, "BOOKING_UPDATED");
            webSocketService.sendMessage("/topic/available-rides", "RIDE_UPDATED");

            if (cancelledByDriver) {
                notificationService.sendNotification(
                        passenger,
                        driver,
                        NotificationType.RIDE_CANCELLED,
                        "Ride Cancelled",
                        "Your booking with " + driver.getUsername() + " has been cancelled.",
                        ride.getId()
                );
            } else {
                notificationService.sendNotification(
                        driver,
                        passenger,
                        NotificationType.RIDE_CANCELLED,
                        "Booking Cancelled",
                        passenger.getUsername() + " cancelled their booking on your ride.",
                        ride.getId()
                );
            }
        } catch (Exception e) {
            log.error("Error while cancelling booking: {}", e.getMessage());
            throw new RuntimeException("Failed to cancel booking: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void cancelPostedRide(Long rideId, Long callerId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (callerId != null && !ride.getRidePoster().getId().equals(callerId)) {
            throw new AccessDeniedException("Only the driver can cancel this posted ride");
        }

        if (ride.getRideStatus() == RideStatus.COMPLETED) {
            throw new IllegalStateException("Completed rides cannot be cancelled");
        }

        ride.setRideStatus(RideStatus.CANCELLED);
        ride.setUpdatedAt(Instant.now());

        try {
            rideRepository.save(ride);
        } catch (Exception e) {
            throw new RuntimeException("Failed to cancel ride: " + e.getMessage(), e);
        }

        List<Booking> activeBookings = bookingRepository.findAllActiveByRideId(rideId);

        for (Booking booking : activeBookings) {
            booking.setStatus(BookingStatus.CANCELLED);
            booking.setUpdatedAt(Instant.now());

            String topic = "/topic/booking-status/" + booking.getId();
            webSocketService.sendMessage(topic, "STATUS_UPDATED");

            notificationService.sendNotification(
                    booking.getBookedRide().getRideRequester(),
                    ride.getRidePoster(),
                    NotificationType.RIDE_CANCELLED,
                    "Ride Cancelled",
                    ride.getRidePoster().getUsername() + " cancelled the ride you had booked.",
                    ride.getId()
            );
        }

        if (!activeBookings.isEmpty()) {
            bookingRepository.saveAll(activeBookings);
        }
        webSocketService.sendMessage("/topic/available-rides", "RIDE_UPDATED");
    }
}
