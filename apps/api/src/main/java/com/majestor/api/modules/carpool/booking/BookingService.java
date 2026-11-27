package com.majestor.api.modules.carpool.booking;

import com.majestor.api.infra.exception.AccessDeniedException;
import com.majestor.api.infra.exception.DuplicateResourceException;
import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.infra.websocket.WebSocketService;
import com.majestor.api.modules.carpool.booking.dto.CreateBookingDTO;
import com.majestor.api.modules.carpool.booking.dto.CreateBookingResponseDTO;
import com.majestor.api.modules.carpool.booking.dto.GetBookingDTO;
import com.majestor.api.modules.carpool.booking.dto.GetBookingStatusResponseDTO;
import com.majestor.api.modules.carpool.ride.Ride;
import com.majestor.api.modules.carpool.ride.RideRepository;
import com.majestor.api.modules.carpool.ride.RideStatus;
import com.majestor.api.modules.carpool.rideRequest.RideRequest;
import com.majestor.api.modules.carpool.rideRequest.RideRequestRepository;
import com.majestor.api.modules.carpool.rideRequest.RideRequestStatus;
import com.majestor.api.modules.notification.NotificationService;
import com.majestor.api.modules.notification.NotificationType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final RideRequestRepository rideRequestRepository;
    private final BookingMapper bookingMapper;
    private final WebSocketService webSocketService;
    private final NotificationService notificationService;

    @Transactional
    public CreateBookingResponseDTO createBooking(
            Long rideRequestId,
            Long rideId,
            CreateBookingDTO createBookingDTO,
            Long callerId
    ) {
        RideRequest rideRequest = rideRequestRepository.findById(rideRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride Request not found with id: " + rideRequestId));

        if (callerId != null && !rideRequest.getRideRequester().getId().equals(callerId)) {
            throw new AccessDeniedException("You can only create bookings for your own ride request");
        }

        if (Boolean.TRUE.equals(rideRequest.getRideRequester().isCarpoolSuspended())) {
            throw new IllegalStateException("Your carpool access is currently suspended");
        }

        if (rideRequest.getRideRequestStatus() != RideRequestStatus.ACTIVE) {
            throw new IllegalStateException("This ride request is no longer active");
        }

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (ride.getRidePoster().getId().equals(rideRequest.getRideRequester().getId())) {
            throw new IllegalArgumentException("You cannot book your own ride");
        }

        if (Boolean.TRUE.equals(ride.getRidePoster().isCarpoolSuspended())) {
            throw new IllegalStateException("This ride is no longer available");
        }

        if (ride.getRideStatus() != RideStatus.ACTIVE
                || ride.getCreatedAt().isBefore(Instant.now().minus(10, ChronoUnit.MINUTES))) {
            throw new IllegalStateException("This ride has expired");
        }

        if (ride.getAvailableSeats() == null || rideRequest.getNumberOfPassengers() > ride.getAvailableSeats()) {
            throw new IllegalStateException("Not enough available seats on this ride");
        }

        if (bookingRepository.existsActiveByRideIdAndRideRequestId(rideId, rideRequestId)) {
            throw new DuplicateResourceException("You already have an active booking for this ride");
        }

        Booking booking = Booking
                .builder()
                .ride(ride)
                .bookedRide(rideRequest)
                .deviationKm(createBookingDTO.getDeviationKm())
                .status(BookingStatus.BOOKED)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        try {
            bookingRepository.save(booking);
            String topic = "/topic/ride-requests/" + ride.getId();
            webSocketService.sendMessage(topic, "NEW_BOOKING_REQUEST");

            notificationService.sendNotification(
                    ride.getRidePoster(),
                    rideRequest.getRideRequester(),
                    NotificationType.RIDE_BOOKED,
                    "New Ride Booking",
                    rideRequest.getRideRequester().getUsername() + " wants to join your ride!",
                    ride.getId()
            );
        } catch (Exception e) {
            log.error("Error while creating booking: {}", e.getMessage());
            throw new RuntimeException("Failed to create booking: " + e.getMessage(), e);
        }

        return bookingMapper.toCreateBookingResponseDTO(booking);
    }

    public CreateBookingResponseDTO createBooking(
            Long rideRequestId,
            Long rideId,
            CreateBookingDTO createBookingDTO
    ) {
        return createBooking(rideRequestId, rideId, createBookingDTO, null);
    }

    @Transactional(readOnly = true)
    public List<GetBookingDTO> getBookings(
            Long rideId,
            Long callerId
    ) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (callerId != null && !ride.getRidePoster().getId().equals(callerId)) {
            throw new AccessDeniedException("Only the driver can view bookings for this ride");
        }

        Instant cutoff = Instant.now().minus(10, ChronoUnit.MINUTES);
        List<Booking> bookedRides;

        try {
            bookedRides = bookingRepository.findByRideId(ride.getId(), cutoff);
        } catch (Exception e) {
            log.error("Error while getting bookings: {}", e.getMessage());
            throw new RuntimeException("Failed to get bookings: " + e.getMessage(), e);
        }

        return bookedRides
                .stream()
                .map(bookingMapper::toGetBookingDTO)
                .toList();
    }

    public List<GetBookingDTO> getBookings(Long rideId) {
        return getBookings(rideId, null);
    }

    @Transactional(readOnly = true)
    public GetBookingDTO getBookingDetails(Long bookingId, Long callerId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        Long driverId = booking.getRide().getRidePoster().getId();
        Long passengerId = booking.getBookedRide().getRideRequester().getId();

        if (callerId != null && !callerId.equals(driverId) && !callerId.equals(passengerId)) {
            throw new AccessDeniedException("You are not authorized to view this booking");
        }

        return bookingMapper.toGetBookingDTO(booking);
    }

    @Transactional(readOnly = true)
    public GetBookingStatusResponseDTO getBookingStatus(Long bookingId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        Ride ride = booking.getRide();

        return GetBookingStatusResponseDTO
                .builder()
                .id(booking.getId())
                .status(booking.getStatus().name())
                .rideStatus(ride.getRideStatus() != null ? ride.getRideStatus().name() : null)
                .availableSeats(ride.getAvailableSeats())
                .acceptedAt(booking.getAcceptedAt())
                .build();
    }

    @Transactional
    public void acceptBooking(Long bookingId, Long callerId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        Ride ride = booking.getRide();

        if (callerId != null && !ride.getRidePoster().getId().equals(callerId)) {
            throw new AccessDeniedException("Only the driver can accept a booking");
        }

        if (booking.getStatus() != BookingStatus.BOOKED) {
            throw new IllegalStateException("Only pending bookings can be accepted");
        }

        if (ride.getRideStatus() != RideStatus.ACTIVE) {
            throw new IllegalStateException("This ride is no longer accepting new bookings");
        }

        int requestedSeats = booking.getBookedRide().getNumberOfPassengers();
        int currentAvailableSeats = ride.getAvailableSeats() != null ? ride.getAvailableSeats() : 0;

        if (requestedSeats > currentAvailableSeats) {
            throw new IllegalStateException("Not enough seats remaining to accept this booking");
        }

        int remainingSeats = currentAvailableSeats - requestedSeats;
        ride.setAvailableSeats(remainingSeats);
        ride.setUpdatedAt(Instant.now());

        if (remainingSeats == 0) {
            ride.setRideStatus(RideStatus.ACCEPTED);
        }

        Instant now = Instant.now();
        booking.setStatus(BookingStatus.ACCEPTED);
        booking.setAcceptedAt(now);
        booking.setUpdatedAt(now);

        // Auto-reject any pending bookings that no longer fit in the remaining seats
        List<Booking> allBookings = bookingRepository.findAllActiveByRideId(ride.getId());
        List<Booking> autoRejectedBookings = new ArrayList<>();

        for (Booking otherBooking : allBookings) {
            if (!otherBooking.getId().equals(bookingId)
                    && otherBooking.getStatus() == BookingStatus.BOOKED
                    && otherBooking.getBookedRide().getNumberOfPassengers() > remainingSeats) {
                otherBooking.setStatus(BookingStatus.REJECTED);
                otherBooking.setUpdatedAt(now);
                autoRejectedBookings.add(otherBooking);
            }
        }

        try {
            bookingRepository.save(booking);
            rideRepository.save(ride);

            if (!autoRejectedBookings.isEmpty()) {
                bookingRepository.saveAll(autoRejectedBookings);
                for (Booking rejected : autoRejectedBookings) {
                    webSocketService.sendMessage("/topic/booking-status/" + rejected.getId(), "STATUS_UPDATED");
                    notificationService.sendNotification(
                            rejected.getBookedRide().getRideRequester(),
                            ride.getRidePoster(),
                            NotificationType.RIDE_REJECTED,
                            "Ride Full",
                            "Not enough seats remaining on " + ride.getRidePoster().getUsername() + "'s ride.",
                            ride.getId()
                    );
                }
            }

            webSocketService.sendMessage("/topic/booking-status/" + bookingId, "STATUS_UPDATED");
            webSocketService.sendMessage("/topic/ride-requests/" + ride.getId(), "BOOKING_UPDATED");
            webSocketService.sendMessage("/topic/available-rides", "RIDE_UPDATED");

            notificationService.sendNotification(
                    booking.getBookedRide().getRideRequester(),
                    ride.getRidePoster(),
                    NotificationType.RIDE_ACCEPTED,
                    "Ride Accepted!",
                    "Your ride booking has been accepted by " + ride.getRidePoster().getUsername(),
                    ride.getId()
            );
        } catch (Exception e) {
            log.error("Error while accepting booking: {}", e.getMessage());
            throw new RuntimeException("Failed to accept booking: " + e.getMessage(), e);
        }
    }

    public void acceptBooking(Long bookingId) {
        acceptBooking(bookingId, null);
    }

    @Transactional
    public void markArrived(Long bookingId, Long passengerId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new IllegalStateException("Ride must be in ACCEPTED state to mark as arrived");
        }

        RideRequest rideRequest = booking.getBookedRide();
        if (!rideRequest.getRideRequester().getId().equals(passengerId)) {
            throw new IllegalArgumentException("Only the passenger can mark as arrived");
        }

        Ride ride = booking.getRide();

        booking.setStatus(BookingStatus.COMPLETED);
        booking.setUpdatedAt(Instant.now());
        rideRequest.setRideRequestStatus(RideRequestStatus.COMPLETED);
        rideRequest.setUpdatedAt(Instant.now());

        bookingRepository.save(booking);
        rideRequestRepository.save(rideRequest);

        long remainingAccepted = bookingRepository.countAcceptedByRideId(ride.getId());
        List<Booking> remainingActive = bookingRepository.findAllActiveByRideId(ride.getId());
        boolean windowExpired = ride.getCreatedAt() != null
                && ride.getCreatedAt().isBefore(Instant.now().minus(10, ChronoUnit.MINUTES));

        if (remainingAccepted == 0 && (ride.getAvailableSeats() == 0 || windowExpired || remainingActive.isEmpty())) {
            ride.setRideStatus(RideStatus.COMPLETED);
            ride.setUpdatedAt(Instant.now());
            rideRepository.save(ride);
        }

        try {
            webSocketService.sendMessage("/topic/booking-status/" + bookingId, "STATUS_UPDATED");
            webSocketService.sendMessage("/topic/ride-requests/" + ride.getId(), "BOOKING_UPDATED");

            notificationService.sendNotification(
                    ride.getRidePoster(),
                    rideRequest.getRideRequester(),
                    NotificationType.PASSENGER_ARRIVED,
                    "Passenger Arrived",
                    rideRequest.getRideRequester().getUsername() + " has marked the ride as complete.",
                    ride.getId()
            );
        } catch (Exception e) {
            log.error("Error while marking arrival for bookingId: {}", bookingId, e);
            throw new RuntimeException("Failed to mark arrival. Please try again.", e);
        }
    }

    @Transactional
    public void rejectBooking(Long bookingId, Long callerId) {
        Booking booking = bookingRepository.findByIdWithDetails(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        Ride ride = booking.getRide();

        if (callerId != null && !ride.getRidePoster().getId().equals(callerId)) {
            throw new AccessDeniedException("Only the driver can reject a booking");
        }

        if (booking.getStatus() != BookingStatus.BOOKED) {
            throw new IllegalStateException("Only pending bookings can be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setUpdatedAt(Instant.now());

        try {
            bookingRepository.save(booking);

            String topic = "/topic/booking-status/" + bookingId;
            webSocketService.sendMessage(topic, "STATUS_UPDATED");
            webSocketService.sendMessage("/topic/ride-requests/" + ride.getId(), "BOOKING_UPDATED");

            notificationService.sendNotification(
                    booking.getBookedRide().getRideRequester(),
                    ride.getRidePoster(),
                    NotificationType.RIDE_REJECTED,
                    "Ride Rejected",
                    "Your ride booking has been rejected by " + ride.getRidePoster().getUsername(),
                    ride.getId()
            );
        } catch (Exception e) {
            log.error("Error while rejecting booking: {}", e.getMessage());
            throw new RuntimeException("Failed to reject booking: " + e.getMessage(), e);
        }
    }

    public void rejectBooking(Long bookingId) {
        rejectBooking(bookingId, null);
    }
}
