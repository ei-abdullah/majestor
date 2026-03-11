package com.majestor.api.modules.user;

import com.majestor.api.modules.user.dto.GetUserDetailsResponseDTO;
import com.majestor.api.modules.user.dto.UpdateUserDetailsRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

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
