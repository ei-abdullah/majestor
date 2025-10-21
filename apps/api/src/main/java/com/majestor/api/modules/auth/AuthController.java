package com.majestor.api.modules.auth;

import com.majestor.api.modules.auth.dto.AuthResponseDTO;
import com.majestor.api.modules.auth.dto.LoginRequestDTO;
import com.majestor.api.modules.auth.dto.SignupRequestDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
            @RequestBody @Valid LoginRequestDTO request
    ) {
        AuthResponseDTO response = authService.login(request);

        return ResponseEntity
                .ok()
                .body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(
            @RequestBody @Valid SignupRequestDTO request
    ) {
        authService.signup(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Please verify your email before logging in!. Check your inbox for verification link."));
    }

    @GetMapping("/signup/verify")
    public ResponseEntity<?> verifyEmail(
            @RequestParam("token") String token
    ) {
        authService.verifyEmail(token);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "Email verified successfully!"));
    }

}
