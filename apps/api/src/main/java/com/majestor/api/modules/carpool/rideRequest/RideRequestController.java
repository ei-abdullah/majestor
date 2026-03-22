package com.majestor.api.modules.carpool.rideRequest;

import com.majestor.api.modules.carpool.rideRequest.dto.UploadRideRequestDTO;
import com.majestor.api.modules.carpool.rideRequest.dto.UploadRideRequestResponseDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.Parameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/v1/rideRequest")
@RequiredArgsConstructor
public class RideRequestController {

    private final RideRequestService rideRequestService;

    @PostMapping("/uploadRideRequest/{userId}")
    public ResponseEntity<UploadRideRequestResponseDTO> uploadRideRequest(
            @Valid @RequestBody UploadRideRequestDTO uploadRideRequestDTO,
            @PathVariable @NotNull @Positive Long userId
    ) {
        UploadRideRequestResponseDTO uploadedRide = rideRequestService.uploadRideRequest(uploadRideRequestDTO, userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(uploadedRide);
    }

    @PatchMapping("/cancelRideRequest/{rideRequestId}")
    public ResponseEntity<?> cancelRideRequest(
            @PathVariable Long rideRequestId
     ) {

        rideRequestService.cancelRideRequest(rideRequestId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}
