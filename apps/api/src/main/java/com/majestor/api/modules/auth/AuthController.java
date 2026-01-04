package com.majestor.api.modules.auth;

import com.majestor.api.infra.emailservice.HtmlPageService;
import com.majestor.api.modules.auth.dto.AuthResponseDTO;
import com.majestor.api.modules.auth.dto.LoginRequestDTO;
import com.majestor.api.modules.auth.dto.RefreshRequestDTO;
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
    private final HtmlPageService htmlPageService;

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
                .body(Map.of("message", "Please verify your email before logging in! Check your inbox for verification link."));
    }

    @GetMapping("/signup/verify")
    public ResponseEntity<String> verifyEmail(
            @RequestParam("token") @NotBlank String token
    ) {
        try {
            authService.verifyEmail(token);
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .header("Content-Type", "text/html")
                    .body(htmlPageService.getVerificationSuccessPage());
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .header("Content-Type", "text/html")
                    .body(htmlPageService.getVerificationErrorPage(e.getMessage()));
        }
    }

    @PostMapping("/forgetPassword")
    public ResponseEntity<Map<String, String>> forgetPassword(
            @RequestParam("email") @NotBlank String email
    ) {
        authService.forgetPassword(email);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("message", "Password reset successfully!"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDTO> refresh(
            @Valid @RequestBody RefreshRequestDTO request
    ) {
        AuthResponseDTO response = authService.refreshAccessToken(request);

        return ResponseEntity
                .ok()
                .body(response);
    }
}
