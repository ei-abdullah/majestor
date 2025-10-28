package com.majestor.api.modules.user;

import com.majestor.api.modules.user.dto.GetUserDetailsResponseDTO;
import com.majestor.api.modules.user.dto.UpdateUserDetailsRequestDTO;
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
            @PathVariable("userId") Long userId
    ) {
        GetUserDetailsResponseDTO response = userService.getUserDetails(userId);

        return ResponseEntity
                .ok()
                .body(response);
    }

    @PatchMapping("/updateUserDetails/{userId}")
    public ResponseEntity<?> updateUserDetails(
            @PathVariable("userId") Long userId,
            @RequestBody UpdateUserDetailsRequestDTO updateUserDetailsRequestDTO
    ) {
        userService.updateUserDetails(userId, updateUserDetailsRequestDTO);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}
