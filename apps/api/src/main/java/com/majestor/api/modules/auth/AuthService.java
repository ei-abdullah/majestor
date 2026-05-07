package com.majestor.api.modules.auth;

import com.majestor.api.infra.emailservice.EmailService;
import com.majestor.api.infra.exception.DuplicateResourceException;
import com.majestor.api.infra.exception.InsufficientAuthenticationException;
import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.infra.jwt.JwtService;
import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.academia.faculty.FacultyRepository;
import com.majestor.api.modules.academia.university.University;
import com.majestor.api.modules.academia.university.UniversityRepository;
import com.majestor.api.modules.auth.dto.*;
import com.majestor.api.modules.user.Role;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UniversityRepository universityRepository;
    private final FacultyRepository facultyRepository;
    private final AuthMapper authMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Value("${app.free-trial:false}")
    private boolean freeTrial;

    @Transactional
    public void signup(
            SignupRequestDTO request
    ) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already exists");
        }

        University university = universityRepository.findById(request.getUniversityId())
                .orElseThrow(() -> new ResourceNotFoundException("University not found"));

        Faculty faculty = facultyRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

        String email = request.getEmail().trim().toLowerCase();
        String domain = email.substring(email.indexOf("@") + 1);

        boolean isAllowedDomain = university.getAllowedDomains()
                .stream()
                .anyMatch(allowed -> allowed.equalsIgnoreCase(domain));

        if(!isAllowedDomain) {
            throw new IllegalArgumentException("Email domain is not allowed for the selected university");
        }

        List<Role> roles = request.getIsFaculty()
                ? List.of(Role.FACULTY)
                : List.of(Role.STUDENT);

        User user = authMapper.toUser(request, university, faculty, roles);

        String verificationToken = generateVerificationToken();
        user.setVerificationToken(verificationToken);
        user.setIsVerified(false);

        if (freeTrial) {
            user.setPremiumUntil(Instant.now().plus(60, ChronoUnit.DAYS));
        }

        userRepository.save(user);

        // Build URL in the request context before async execution
        String verificationUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/v1/auth/signup/verify")
                .queryParam("token", verificationToken)
                .toUriString();

        emailService.sendVerificationEmail(user.getEmail(), verificationUrl);
    }

    public void verifyEmail(
            String token
    ) {
        User user = userRepository.findByVerificationToken(token);

        if (user == null) {
            throw new EntityNotFoundException("User not found with verification token: " + token);
        }

        if (Boolean.TRUE.equals(user.getIsVerified())) {
            throw new DuplicateResourceException("Email already verified");
        }

        user.setVerificationToken(null);
        user.setIsVerified(true);
        userRepository.save(user);
    }

    public AuthResponseDTO login(
            LoginRequestDTO request
    ) {
        String lowerCasedEmail = request.getEmail().trim().toLowerCase();

        Optional<User> user = userRepository.findByEmail(lowerCasedEmail);

        if (user.isEmpty()) {
            throw new ResourceNotFoundException("User not found with email: " + lowerCasedEmail);
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        lowerCasedEmail,
                        request.getPassword()
                )
        );

        if (!authentication.isAuthenticated()) {
            throw new InsufficientAuthenticationException("Invalid email or password");
        }

        String accessToken = jwtService.generateAccessToken(user.get());
        String refreshToken = jwtService.generateRefreshToken(user.get());

        AuthUserDTO authUserDTO = authMapper.toAuthUserDTO(user.get());

        return authMapper.toAuthResponseDTO(accessToken, refreshToken, authUserDTO);
    }

    public AuthResponseDTO refreshAccessToken(
            RefreshRequestDTO requestDTO
    ) {
        boolean isValid = jwtService.validateToken(requestDTO.getRefreshToken());

        if (!isValid) {
            throw new InsufficientAuthenticationException("Invalid refresh token");
        }

        String email = jwtService.extractEmail(requestDTO.getRefreshToken());

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + email));

        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = requestDTO.getRefreshToken();

        AuthUserDTO authUserDTO = authMapper.toAuthUserDTO(user);

        return authMapper.toAuthResponseDTO(accessToken, refreshToken, authUserDTO);

    }

    public void forgetPassword(String email) {
        /*
        TODO: Implement forget password functionality
        1. Get user email
        2. Generate password reset token
        3. Save token to user entity with expiration time
        4. Send email with password reset link
        5. Create endpoint to reset password using token
        6. Validate token and expiration time
        7. Update user password
        8. Invalidate the token after use
        */
    }

    private String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }
}
