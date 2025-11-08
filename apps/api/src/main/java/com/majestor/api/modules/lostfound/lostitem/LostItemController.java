package com.majestor.api.modules.lostfound.lostitem;

import com.majestor.api.modules.lostfound.lostitem.dto.CreateLostItemRequestDTO;
import com.majestor.api.modules.lostfound.lostitem.dto.LostItemAndFoundersResponseDTO;
import com.majestor.api.modules.lostfound.lostitem.dto.LostItemResponseDTO;
import com.majestor.api.modules.lostfound.lostitem.dto.LostItemsResponseDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/v1/lostItem")
@RequiredArgsConstructor
public class LostItemController {

    private final LostItemService lostItemService;

    // Create lost item's request
    @PostMapping(
            value = "/createRequest/{userId}",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<?> createLostItemRequest(
            @Valid @ModelAttribute CreateLostItemRequestDTO createLostItemRequestDTO,
            @PathVariable("userId") @NotNull @Positive Long ownerId
    ) {
        lostItemService.createLostItemRequest(createLostItemRequestDTO, ownerId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    // Get a list of all lost items, including images, of a user and filter it by status, FOUND/LOST
    @GetMapping("/findLostItemsByUserId/{userId}")
    public ResponseEntity<List<LostItemResponseDTO>> findLostItemsByUserId(
            @PathVariable("userId") @NotNull @Positive Long ownerId,
            @RequestParam("status") @NotBlank String status
    ) {
        List<LostItemResponseDTO> lostItemsList = lostItemService.findLostItemsByUserId(ownerId, status);

        return ResponseEntity
                .ok()
                .body(lostItemsList);
    }

    // Get all lost items with the status of LOST
    @GetMapping("/findAllLostItems")
    public ResponseEntity<Object> findAllLostItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<LostItemsResponseDTO> response = lostItemService.findAllLostItems(pageable);

        return ResponseEntity
                .ok()
                .body(response);
    }

    // Get a specific lost item by its id along with its images and its founders
    @GetMapping("/findLostItemWithFounders/{lostItemId}")
    public ResponseEntity<LostItemAndFoundersResponseDTO> findLostItemWithFounders(
            @PathVariable("lostItemId") @NotNull @Positive Long lostItemId
    ) {
        LostItemAndFoundersResponseDTO response = lostItemService.findLostItemWithFounders(lostItemId);

        return ResponseEntity
                .ok()
                .body(response);
    }

    // Mark lostItem as found
    @PatchMapping("/markLostItemFound/{lostItemId}")
    public ResponseEntity<?> markLostItemFound(
            @PathVariable("lostItemId") @NotNull @Positive Long lostItemId
    ) {
        lostItemService.markLostItemFound(lostItemId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}
