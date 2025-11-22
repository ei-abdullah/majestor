package com.majestor.api.modules.auth;

import com.majestor.api.modules.auth.dto.AuthResponseDTO;
import com.majestor.api.modules.auth.dto.LoginRequestDTO;
import com.majestor.api.modules.auth.dto.SignupRequestDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Validated
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO request
    ) {
        AuthResponseDTO response = authService.login(request);

        return ResponseEntity
                .ok()
                .body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @Valid @RequestBody SignupRequestDTO request
    ) {
        authService.signup(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Please verify your email before logging in!. Check your inbox for verification link."));
    }

    @GetMapping("/signup/verify")
    public ResponseEntity<?> verifyEmail(
            @RequestParam("token") @NotBlank String token
    ) {
        authService.verifyEmail(token);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "Email verified successfully!"));
    }

    @PostMapping("/forgetPassword")
    public ResponseEntity<?> forgetPassword(
            @RequestParam("email") @NotBlank String email
    ) {
        authService.forgetPassword(email);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "Password reset successfully!"));
    }
}
