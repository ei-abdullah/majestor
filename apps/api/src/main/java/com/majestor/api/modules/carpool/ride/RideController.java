package com.majestor.api.modules.carpool.ride;

import com.majestor.api.infra.exception.AccessDeniedException;
import com.majestor.api.modules.carpool.fare.FareConfigService;
import com.majestor.api.modules.carpool.fare.dto.FareConfigDTO;
import com.majestor.api.modules.carpool.fare.dto.UpdateFareConfigDTO;
import com.majestor.api.modules.carpool.ride.dto.GetRecentRidesDTO;
import com.majestor.api.modules.carpool.ride.dto.UploadRideDTO;
import com.majestor.api.modules.carpool.ride.dto.UploadRideResponseDTO;
import com.majestor.api.modules.user.UserPrincipal;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
            @RequestBody @Valid UpdateFareConfigDTO dto,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        boolean isAdmin = principal != null && principal.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        if (!isAdmin) {
            throw new AccessDeniedException("Only administrators can update fare configuration");
        }

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
            @PathVariable @NotNull @Positive Long userId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        if (principal != null && !principal.getId().equals(userId)) {
            throw new AccessDeniedException("You can only post rides for your own account");
        }

        UploadRideResponseDTO uploadedRide = rideService.uploadRide(uploadRideDTO, userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(uploadedRide);
    }

    /**
     * Get a single ride by ID (used to verify status / recover persisted state)
     */
    @GetMapping("/{rideId}")
    public ResponseEntity<GetRecentRidesDTO> getRideById(
            @PathVariable @NotNull @Positive Long rideId
    ) {
        return ResponseEntity.ok(rideService.getRideById(rideId));
    }

    /**
     * Get a list of recent posted rides created within the last 10 minutes
     * with status ACTIVE. Rides older than 10 minutes are considered expired.
     * Supports optional proximity sorting/filtering.
     */
    @GetMapping("/recentRides")
    public ResponseEntity<List<GetRecentRidesDTO>> getRecentRides(
            @RequestParam(required = false) Double pickupLat,
            @RequestParam(required = false) Double pickupLng,
            @RequestParam(required = false) Double dropoffLat,
            @RequestParam(required = false) Double dropoffLng,
            @RequestParam(required = false) Integer passengers,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long currentUserId = principal != null ? principal.getId() : null;
        List<GetRecentRidesDTO> ridesList = rideService.getRecentRides(
                pickupLat,
                pickupLng,
                dropoffLat,
                dropoffLng,
                passengers,
                currentUserId
        );

        return ResponseEntity
                .ok()
                .body(ridesList);
    }

    /**
     * Mark a ride booking as completed. Only the ride poster can complete the ride.
     */
    @PatchMapping("/completeRide/{rideId}/{bookingId}")
    public ResponseEntity<?> completeRide(
            @PathVariable @NotNull @Positive Long rideId,
            @PathVariable @NotNull @Positive Long bookingId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long callerId = principal != null ? principal.getId() : null;
        rideService.completeRide(rideId, bookingId, callerId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    /**
     * Cancel a booked ride (can be invoked by driver or passenger).
     */
    @PatchMapping("/cancelBookedRide/{rideId}/{bookingId}")
    public ResponseEntity<?> cancelBookedRide(
            @PathVariable @NotNull @Positive Long rideId,
            @PathVariable @NotNull @Positive Long bookingId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long callerId = principal != null ? principal.getId() : null;
        rideService.cancelBookedRide(rideId, bookingId, callerId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    /**
     * Cancel a posted ride. Used by the driver.
     */
    @PatchMapping("/cancelPostedRide/{rideId}")
    public ResponseEntity<?> cancelPostedRide(
            @PathVariable @NotNull @Positive Long rideId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long callerId = principal != null ? principal.getId() : null;
        rideService.cancelPostedRide(rideId, callerId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}
