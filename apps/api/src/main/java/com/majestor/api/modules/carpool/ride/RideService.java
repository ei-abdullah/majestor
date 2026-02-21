package com.majestor.api.modules.carpool.ride;

import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.modules.carpool.ride.dto.GetRecentRidesDTO;
import com.majestor.api.modules.carpool.ride.dto.UploadRideDTO;
import com.majestor.api.modules.carpool.ride.dto.UploadRideResponseDTO;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
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
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(10);

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
}
