package com.majestor.api.modules.user;

import com.majestor.api.modules.user.dto.GetUserDetailsResponseDTO;
import com.majestor.api.modules.user.dto.UpdateUserDetailsRequestDTO;
import com.majestor.api.modules.user.dto.UserSearchDTO;
import com.majestor.api.modules.user.dto.UserStatsDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

// TODO: IDOR vulnerability — all endpoints accept userId as a path param with no ownership check.
// Any authenticated user can read/modify any other user's data by guessing their ID.
// Fix: extract the authenticated user's ID from the JWT principal in SecurityContextHolder
// and verify it matches the requested userId before proceeding.
@Validated
@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/getUserDetails/{userId}")
    public ResponseEntity<GetUserDetailsResponseDTO> getUserDetails(
            @PathVariable @NotNull @Positive Long userId
    ) {
        GetUserDetailsResponseDTO response = userService.getUserDetails(userId);

        return ResponseEntity
                .ok()
                .body(response);
    }

    @PatchMapping(
            value = "/updateProfileImage/{userId}",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<?> updateProfileImage(
            @RequestParam("profileImage") @NotNull MultipartFile profileImage,
            @PathVariable @NotNull @Positive Long userId
    ) {
        userService.updateProfileImage(profileImage, userId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @PatchMapping("/updateUserDetails/{userId}")
    public ResponseEntity<?> updateUserDetails(
            @PathVariable @NotNull @Positive Long userId,
            @Valid @RequestBody UpdateUserDetailsRequestDTO updateUserDetailsRequestDTO
    ) {
        userService.updateUserDetails(userId, updateUserDetailsRequestDTO);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @PatchMapping("/update-push-token/{userId}")
    public ResponseEntity<?> updatePushToken(
            @PathVariable @NotNull @Positive Long userId,
            @RequestParam("pushToken") @NotNull String pushToken
    ) {
        userService.updatePushToken(userId, pushToken);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserSearchDTO>> searchUsers(
            @RequestParam String query,
            @RequestParam @NotNull @Positive Long requestingUserId
    ) {
        return ResponseEntity.ok(userService.searchUsers(query, requestingUserId));
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<UserStatsDTO> getUserStats(@PathVariable @NotNull @Positive Long userId) {
        return ResponseEntity.ok(userService.getUserStats(userId));
    }

    @Deprecated
    @PatchMapping("/markOnboarded/{userId}")
    public ResponseEntity<?> markOnboarded(
            @PathVariable @NotNull @Positive Long userId
    ) {
        userService.markOnboarded(userId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "User marked as onboarded successfully!"));
    }
}
