package com.majestor.api.modules.user;

import com.majestor.api.modules.user.dto.GetUserDetailsResponseDTO;
import com.majestor.api.modules.user.dto.UpdateUserDetailsRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/getUserDetails/{userId}")
    public ResponseEntity<GetUserDetailsResponseDTO> getUserDetails(
            @PathVariable("userId") @NotNull @Positive Long userId
    ) {
        GetUserDetailsResponseDTO response = userService.getUserDetails(userId);

        return ResponseEntity
                .ok()
                .body(response);
    }

    @PatchMapping("/updateUserDetails/{userId}")
    public ResponseEntity<?> updateUserDetails(
            @PathVariable("userId") @NotNull @Positive Long userId,
            @Valid @RequestBody UpdateUserDetailsRequestDTO updateUserDetailsRequestDTO
    ) {
        userService.updateUserDetails(userId, updateUserDetailsRequestDTO);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}
