package com.majestor.api.modules.carpool.booking;

import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.modules.carpool.booking.dto.CreateBookingDTO;
import com.majestor.api.modules.carpool.booking.dto.GetBookingDTO;
import com.majestor.api.modules.carpool.booking.dto.GetBookingStatusResponseDTO;
import com.majestor.api.modules.carpool.ride.Ride;
import com.majestor.api.modules.carpool.ride.RideRepository;
import com.majestor.api.modules.carpool.ride.RideStatus;
import com.majestor.api.modules.carpool.rideRequest.RideRequest;
import com.majestor.api.modules.carpool.rideRequest.RideRequestRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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


    public void createBooking(
            Long rideRequestId,
            Long rideId,
            CreateBookingDTO createBookingDTO
    ) {

        RideRequest rideRequest = rideRequestRepository.findById(rideRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride Request not found with id: " + rideRequestId));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        Booking booking = Booking
                .builder()
                .ride(ride)
                .bookedRide(rideRequest)
                .deviationKm(createBookingDTO.getDeviationKm())
                .status(BookingStatus.BOOKED)
                .build();

        try {
            bookingRepository.save(booking);
        } catch (Exception e) {
            log.error("Error while creating booking: {}", e.getMessage());
            throw new RuntimeException("Failed to create booking: " + e.getMessage(), e);
        }
    }

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
        List<Booking> allBookings = bookingRepository.findByRideId(ride.getId());
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
        } catch (Exception e) {
            log.error("Error while accepting booking: {}", e.getMessage());
            throw new RuntimeException("Failed to accept booking: " + e.getMessage(), e);
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
        } catch (Exception e) {
            log.error("Error while rejecting booking: {}", e.getMessage());
            throw new RuntimeException("Failed to reject booking: " + e.getMessage(), e);
        }
    }
}
