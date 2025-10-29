package com.majestor.api.modules.lostfound.founder;

import com.majestor.api.modules.lostfound.founder.dto.FoundLostItemRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/v1/founder")
@RequiredArgsConstructor
public class FounderController {

    private final FounderService founderService;

    @PostMapping("/foundLostItem/{founderId}/{lostItemId}")
    public ResponseEntity<?> foundLostItem(
            @PathVariable("founderId") @NotNull @Positive Long founderId,
            @PathVariable("lostItemId") @NotNull @Positive Long lostItemId,
            @Valid @RequestBody FoundLostItemRequestDTO foundLostItemRequestDTO
    ) {
        founderService.foundLostItem(
                founderId,
                lostItemId,
                foundLostItemRequestDTO
        );

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}
