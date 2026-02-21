package com.majestor.api.modules.carpool.ride;

import com.majestor.api.modules.carpool.ride.dto.GetRecentRidesDTO;
import com.majestor.api.modules.carpool.ride.dto.UploadRideDTO;
import com.majestor.api.modules.carpool.ride.dto.UploadRideResponseDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/v1/ride")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;

    /**
     * Upload a new ride
     */
    @PostMapping("/uploadRide/{userId}")
    public ResponseEntity<UploadRideResponseDTO> uploadRide(
            @RequestBody @Valid UploadRideDTO uploadRideDTO,
            @PathVariable @NotNull @Positive Long userId
    ) {
        UploadRideResponseDTO uploadedRide = rideService.uploadRide(uploadRideDTO, userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(uploadedRide);
    }

    /**
     * Get a list of recent posted rides with uploaded time < 10 mins
     * and only have a status of BOOKED.
     */
    @GetMapping("/recentRides")
    public ResponseEntity<List<GetRecentRidesDTO>> getRecentRides() {
        List<GetRecentRidesDTO> ridesList = rideService.getRecentRides();

        return ResponseEntity
                .ok()
                .body(ridesList);
    }
}
