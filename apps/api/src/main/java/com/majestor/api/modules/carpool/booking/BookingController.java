package com.majestor.api.modules.carpool.booking;

import com.majestor.api.modules.carpool.booking.dto.CreateBookingDTO;
import com.majestor.api.modules.carpool.booking.dto.CreateBookingResponseDTO;
import com.majestor.api.modules.carpool.booking.dto.GetBookingDTO;
import com.majestor.api.modules.carpool.booking.dto.GetBookingStatusResponseDTO;
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
@RequestMapping("/api/v1/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    /**
     * Create a new booking for poster to see all bookings for their ride
     */
    @PostMapping("/createBooking/{rideRequestId}/{rideId}")
    public ResponseEntity<CreateBookingResponseDTO> createBooking(
            @PathVariable @NotNull @Positive Long rideRequestId,
            @PathVariable @NotNull @Positive Long rideId,
            @RequestBody @Valid CreateBookingDTO createBookingDTO,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long callerId = principal != null ? principal.getId() : null;
        CreateBookingResponseDTO booking = bookingService.createBooking(
                rideRequestId,
                rideId,
                createBookingDTO,
                callerId
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(booking);
    }

    /**
     * Get active bookings (accepted + pending requests) for a particular ride for driver to manage
     */
    @GetMapping("/getBookings/{rideId}")
    public ResponseEntity<List<GetBookingDTO>> getBookings(
            @PathVariable @NotNull @Positive Long rideId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long callerId = principal != null ? principal.getId() : null;
        List<GetBookingDTO> bookings = bookingService.getBookings(rideId, callerId);

        return ResponseEntity
                .ok()
                .body(bookings);
    }

    /**
     * Get full details of a specific booking by ID (used to recover state on app restart)
     */
    @GetMapping("/details/{bookingId}")
    public ResponseEntity<GetBookingDTO> getBookingDetails(
            @PathVariable @NotNull @Positive Long bookingId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long callerId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(bookingService.getBookingDetails(bookingId, callerId));
    }

    /**
     * For polling/checking booking status
     */
    @GetMapping("/getBookingStatus/{bookingId}")
    public ResponseEntity<GetBookingStatusResponseDTO> getBookingStatus(
            @PathVariable @NotNull @Positive Long bookingId
    ) {
        GetBookingStatusResponseDTO bookingStatus = bookingService.getBookingStatus(bookingId);

        return ResponseEntity
                .ok()
                .body(bookingStatus);
    }

    /**
     * Accept the booking, decrement availableSeats, and only mark ride ACCEPTED when availableSeats == 0
     */
    @PatchMapping("/acceptBooking/{bookingId}")
    public ResponseEntity<?> acceptBooking(
            @PathVariable @NotNull @Positive Long bookingId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long callerId = principal != null ? principal.getId() : null;
        bookingService.acceptBooking(bookingId, callerId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    /**
     * Reject a pending booking request
     */
    @PatchMapping("/rejectBooking/{bookingId}")
    public ResponseEntity<?> rejectBooking(
            @PathVariable @NotNull @Positive Long bookingId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long callerId = principal != null ? principal.getId() : null;
        bookingService.rejectBooking(bookingId, callerId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @PatchMapping("/arrive/{bookingId}")
    public ResponseEntity<Void> markArrived(
            @PathVariable @NotNull @Positive Long bookingId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        bookingService.markArrived(bookingId, principal.getId());
        return ResponseEntity.ok().build();
    }

}
