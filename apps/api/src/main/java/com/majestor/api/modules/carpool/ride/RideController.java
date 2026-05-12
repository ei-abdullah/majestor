package com.majestor.api.modules.carpool.ride;

import com.majestor.api.modules.carpool.fare.FareConfigService;
import com.majestor.api.modules.carpool.fare.dto.FareConfigDTO;
import com.majestor.api.modules.carpool.fare.dto.UpdateFareConfigDTO;
import com.majestor.api.modules.carpool.ride.VehicleType;
import com.majestor.api.modules.carpool.ride.dto.GetRecentRidesDTO;
import com.majestor.api.modules.carpool.ride.dto.UploadRideDTO;
import com.majestor.api.modules.carpool.ride.dto.UploadRideResponseDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
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
    private final FareConfigService fareConfigService;

    @GetMapping("/fare-config")
    public ResponseEntity<FareConfigDTO> getFareConfig() {
        FareConfigDTO response = fareConfigService.getFareConfig();

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    @PatchMapping("/fare-config/{vehicleType}")
    public ResponseEntity<FareConfigDTO> updateFareConfig(
            @PathVariable VehicleType vehicleType,
            @RequestBody @Valid UpdateFareConfigDTO dto
    ) {
        FareConfigDTO response = fareConfigService.updateFareConfig(vehicleType, dto);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

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
     * Get a list of recent posted rides created within the last 10 minutes
     * with status ACTIVE. Rides older than 10 minutes are considered expired.
     */
    @GetMapping("/recentRides")
    public ResponseEntity<List<GetRecentRidesDTO>> getRecentRides() {
        List<GetRecentRidesDTO> ridesList = rideService.getRecentRides();

        return ResponseEntity
                .ok()
                .body(ridesList);
    }

    /**
     * Mark a ride as completed. Only the ride poster can complete the ride.
     * Convert the ride status from ACCEPTED to COMPLETED
     */
    @PatchMapping("/completeRide/{rideId}/{bookingId}")
    public ResponseEntity<?> completeRide(
            @PathVariable @NotNull @Positive Long rideId,
            @PathVariable @NotNull @Positive Long bookingId
    ) {
        rideService.completeRide(rideId, bookingId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    /**
     * Cancel a ride. Only the ride poster can cancel the ride.
     * Convert the ride status from ACCEPTED to CANCELLED
     */
    @PatchMapping("/cancelBookedRide/{rideId}/{bookingId}")
    public ResponseEntity<?> cancelBookedRide(
            @PathVariable @NotNull @Positive Long rideId,
            @PathVariable @NotNull @Positive Long bookingId
    ) {
        rideService.cancelBookedRide(rideId, bookingId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    /**
     * Cancel a posted ride that has no accepted bookings.
     * Used by the driver
     */
    @PatchMapping("/cancelPostedRide/{rideId}")
    public ResponseEntity<?> cancelPostedRide(
            @PathVariable @NotNull @Positive Long rideId
    ) {
        rideService.cancelPostedRide(rideId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}
