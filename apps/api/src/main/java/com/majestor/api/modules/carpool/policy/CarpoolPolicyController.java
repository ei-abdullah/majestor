package com.majestor.api.modules.carpool.policy;

import com.majestor.api.modules.user.UserPrincipal;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/carpool/policy")
@RequiredArgsConstructor
public class CarpoolPolicyController {

    private final CarpoolPolicyService carpoolPolicyService;

    @PostMapping("/report-no-show/{bookingId}")
    public ResponseEntity<Void> reportNoShow(
            @PathVariable @NotNull @Positive Long bookingId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        carpoolPolicyService.reportNoShow(bookingId, principal.getId());

        return ResponseEntity
                .ok()
                .build();
    }
}