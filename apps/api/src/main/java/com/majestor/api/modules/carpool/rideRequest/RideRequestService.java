package com.majestor.api.modules.carpool.rideRequest;

import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.modules.carpool.rideRequest.dto.UploadRideRequestDTO;
import com.majestor.api.modules.carpool.rideRequest.dto.UploadRideRequestResponseDTO;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class RideRequestService {

    private final UserRepository userRepository;
    private final RideRequestRepository rideRequestRepository;
    private final RideRequestMapper rideRequestMapper;

    public UploadRideRequestResponseDTO uploadRideRequest(
            UploadRideRequestDTO uploadRideRequestDTO,
            Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

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
    public void cancelRideRequest(Long rideRequestId) {
        RideRequest rideRequest = rideRequestRepository.findById(rideRequestId)
                .orElseThrow(() -> new ResourceNotFoundException("RideRequest not found with id: " + rideRequestId));

        rideRequest.setRideRequestStatus(RideRequestStatus.CANCELLED);

        try {
            rideRequestRepository.save(rideRequest);
        } catch (Exception e) {
            log.error("Error while cancelling ride request: {}", e.getMessage());
            throw new RuntimeException("Failed to save ride request: " + e.getMessage(), e);
        }
    }
}
