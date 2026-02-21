package com.majestor.api.modules.carpool.booking;

import com.majestor.api.modules.carpool.booking.dto.CreateBookingDTO;
import com.majestor.api.modules.carpool.booking.dto.GetBookingDTO;
import com.majestor.api.modules.carpool.booking.dto.GetBookingStatusResponseDTO;
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
@RequestMapping("/api/v1/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    /**
     * Create a new booking for poster to see all booking for his ride
     */
    @PostMapping("/createBooking/{rideRequestId}/{rideId}")
    public ResponseEntity<?> createBooking(
            @PathVariable @NotNull @Positive Long rideRequestId,
            @PathVariable @NotNull @Positive Long rideId,
            @RequestBody @Valid CreateBookingDTO createBookingDTO
    ) {
        bookingService.createBooking(
                rideRequestId,
                rideId,
                createBookingDTO
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    /**
     * Get recent bookings for a particular ride for poster rider to see
     * and confirm or reject the ride
     */
    @GetMapping("/getBookings/{rideId}")
    public ResponseEntity<?> getBookings(
            @PathVariable @NotNull @Positive Long rideId
    ) {
        List<GetBookingDTO> bookings = bookingService.getBookings(rideId);

        return ResponseEntity
                .ok()
                .body(bookings);
    }

    /**
     * For constant polling for ride requestor to check for his ride
     * status, if accepted by rider, move to the final screen
     * else back to Available Rides
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
     * Accept the booking and set the status of booking to BOOKED and
     * ride to ACCEPTED. So it won't be listing in Available Rides
     */
    @PatchMapping("/acceptBooking/{bookingId}")
    public ResponseEntity<?> acceptBooking(
            @PathVariable @NotNull @Positive Long bookingId
    ) {
        bookingService.acceptBooking(bookingId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    /**
     * Reject the booking and set the status of booking to REJECTED, and
     * it won't be listing in Booking Request for poster rider to see (/getBookings)
     */
    @PatchMapping("/rejectBooking/{bookingId}")
    public ResponseEntity<?> rejectBooking(
            @PathVariable @NotNull @Positive Long bookingId
    ) {
        bookingService.rejectBooking(bookingId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

}
