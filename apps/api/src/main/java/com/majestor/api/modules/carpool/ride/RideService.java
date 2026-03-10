package com.majestor.api.modules.carpool.ride;

import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.modules.carpool.booking.Booking;
import com.majestor.api.modules.carpool.booking.BookingRepository;
import com.majestor.api.modules.carpool.booking.BookingStatus;
import com.majestor.api.modules.carpool.ride.dto.GetRecentRidesDTO;
import com.majestor.api.modules.carpool.ride.dto.UploadRideDTO;
import com.majestor.api.modules.carpool.ride.dto.UploadRideResponseDTO;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final RideMapper rideMapper;

    @Transactional
    public UploadRideResponseDTO uploadRide(
            UploadRideDTO uploadRideDTO,
            Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Ride ride = rideMapper.toRide(uploadRideDTO, user);

        try {
            ride = rideRepository.save(ride);
        } catch (Exception e) {
            log.error("Error while saving ride: {}", e.getMessage());
            throw new RuntimeException("Failed to save ride: " + e.getMessage(), e);
        }

        return rideMapper.toUploadRideResponseDTO(ride);
    }

    public List<GetRecentRidesDTO> getRecentRides() {
        Instant cutoffTime = Instant.now().minus(10, ChronoUnit.MINUTES);

        List<Ride> recentRidesList;

        try {
            recentRidesList = rideRepository
                    .findByCreatedAtAfter(cutoffTime)
                    .stream()
                    .filter(ride -> ride.getRideStatus().equals(RideStatus.ACTIVE))
                    .toList();
        } catch (Exception e) {
            log.error("Error while getting recent rides: {}", e.getMessage());
            throw new RuntimeException("Failed to get recent rides: " + e.getMessage(), e);
        }

        return rideMapper.getRecentRidesDTOS(recentRidesList);
    }

    @Scheduled(fixedDelay = 2 * 60 * 60 * 1000) // runs after every 2 hours
    @Transactional
    public void expireOldRides() {
        Instant cutoffTime = Instant.now().minus(2, ChronoUnit.HOURS);
        try {
            rideRepository.updateExpiredRides(cutoffTime, RideStatus.ACTIVE, RideStatus.EXPIRED);
            log.info("Expired rides older than 2 hours at {}", Instant.now());
        } catch (Exception e) {
            log.error("Error while expiring old rides: {}", e.getMessage());
        }
    }

    @Transactional
    public void completeRide(Long rideId, Long bookingId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        Booking booking = bookingRepository.findById(bookingId)
                        .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        ride.setRideStatus(RideStatus.COMPLETED);
        booking.setStatus(BookingStatus.COMPLETED);

        try {
            rideRepository.save(ride);
            bookingRepository.save(booking);
        } catch (Exception e) {
            log.error("Error while completing ride: {}", e.getMessage());
            throw new RuntimeException("Failed to complete ride: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void cancelRide(Long rideId, Long bookingId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        Booking booking = bookingRepository.findById(bookingId)
                        .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        ride.setRideStatus(RideStatus.CANCELLED);
        booking.setStatus(BookingStatus.CANCELLED);

        try {
            rideRepository.save(ride);
            bookingRepository.save(booking);
        } catch (Exception e) {
            log.error("Error while cancelling booking: {}", e.getMessage());
            throw new RuntimeException("Failed to cancelling booking: " + e.getMessage(), e);
        }
    }
}