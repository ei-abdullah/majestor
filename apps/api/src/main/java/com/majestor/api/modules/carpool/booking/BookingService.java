package com.majestor.api.modules.carpool.booking;

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
import com.majestor.api.modules.notification.NotificationService;
import com.majestor.api.modules.notification.NotificationType;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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
            CreateBookingDTO createBookingDTO
    ) {

        RideRequest rideRequest = rideRequestRepository.findById(rideRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride Request not found with id: " + rideRequestId));

        if (Boolean.TRUE.equals(rideRequest.getRideRequester().isCarpoolSuspended())) {
            throw new IllegalStateException("Your carpool access is currently suspended");
        }

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (Boolean.TRUE.equals(ride.getRidePoster().isCarpoolSuspended())) {
            throw new IllegalStateException("This ride is no longer available");
        }

        if (ride.getRideStatus() != RideStatus.ACTIVE
                || ride.getCreatedAt().isBefore(Instant.now().minus(10, ChronoUnit.MINUTES))) {
            throw new IllegalStateException("This ride has expired");
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

    @Transactional
    public List<GetBookingDTO> getBookings(
            Long rideId
    ) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        List<Booking> bookedRides;

        try {
            bookedRides = bookingRepository.findByRideId(ride.getId());
        } catch (Exception e) {
            log.error("Error while getting bookings: {}", e.getMessage());
            throw new RuntimeException("Failed to get bookings: " + e.getMessage(), e);
        }

        return bookedRides
                .stream()
                .map(bookingMapper::toGetBookingDTO)
                .toList();
    }

    public GetBookingStatusResponseDTO getBookingStatus(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        return GetBookingStatusResponseDTO
                .builder()
                .id(booking.getId())
                .status(booking.getStatus().name())
                .build();
    }

    @Transactional
    public void acceptBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Get the ride
        Ride ride = booking.getRide();

        // Accept the booking
        booking.setStatus(BookingStatus.ACCEPTED);

        // Reject all other bookings
        List<Booking> allBookings = bookingRepository.findAllActiveByRideId(ride.getId());
        List<Booking> otherBookings = new ArrayList<>();

        for (Booking otherBooking : allBookings) {
            if (!otherBooking.getId().equals(bookingId)) {
                otherBooking.setStatus(BookingStatus.REJECTED);
                otherBookings.add(otherBooking);
            }
        }

        if (!otherBookings.isEmpty()) {
            bookingRepository.saveAll(otherBookings);
        }

        // Set the ride status to ACCEPTED so it won't be listing in Available Rides
        ride.setRideStatus(RideStatus.ACCEPTED);

        try {
            bookingRepository.save(booking);
            rideRepository.save(ride);

            // Broadcast booking status
            String topic = "/topic/booking-status/" + bookingId;
            webSocketService.sendMessage(topic, "STATUS_UPDATED");

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

    @Transactional
    public void markArrived(Long bookingId, Long passengerId) {
        Booking booking = bookingRepository.findById(bookingId)
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
        rideRequest.setRideRequestStatus(com.majestor.api.modules.carpool.rideRequest.RideRequestStatus.COMPLETED);
        ride.setRideStatus(RideStatus.COMPLETED);

        try {
            bookingRepository.save(booking);
            rideRequestRepository.save(rideRequest);
            rideRepository.save(ride);

            webSocketService.sendMessage("/topic/booking-status/" + bookingId, "STATUS_UPDATED");

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
    public void rejectBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        // Reject the booking
        booking.setStatus(BookingStatus.REJECTED);

        try {
            bookingRepository.save(booking);

            // Broadcast booking status
            String topic = "/topic/booking-status/" + bookingId;
            webSocketService.sendMessage(topic, "STATUS_UPDATED");

            notificationService.sendNotification(
                    booking.getBookedRide().getRideRequester(),
                    booking.getRide().getRidePoster(),
                    NotificationType.RIDE_REJECTED,
                    "Ride Rejected",
                    "Your ride booking has been rejected by " + booking.getRide().getRidePoster().getUsername(),
                    booking.getRide().getId()
            );
        } catch (Exception e) {
            log.error("Error while rejecting booking: {}", e.getMessage());
            throw new RuntimeException("Failed to reject booking: " + e.getMessage(), e);
        }
    }
}
