package com.majestor.api.modules.lostfound.founder;

import com.majestor.api.modules.lostfound.founder.dto.FoundLostItemRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/founder")
@RequiredArgsConstructor
public class FounderController {

    private final FounderService founderService;

    @PostMapping("/foundLostItem/{founderId}/{lostItemId}")
    public ResponseEntity<?> foundLostItem(
            @PathVariable("founderId") Long founderId,
            @PathVariable("lostItemId") Long lostItemId,
            @RequestBody FoundLostItemRequestDTO foundLostItemRequestDTO
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
