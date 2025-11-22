package com.majestor.api.modules.auth;

import com.majestor.api.infra.emailservice.EmailService;
import com.majestor.api.infra.jwt.JwtService;
import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.academia.faculty.FacultyRepository;
import com.majestor.api.modules.academia.university.University;
import com.majestor.api.modules.academia.university.UniversityRepository;
import com.majestor.api.modules.auth.dto.AuthResponseDTO;
import com.majestor.api.modules.auth.dto.AuthUserDTO;
import com.majestor.api.modules.auth.dto.LoginRequestDTO;
import com.majestor.api.modules.auth.dto.SignupRequestDTO;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import com.sun.jdi.request.DuplicateRequestException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

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


    @Transactional
    public void signup(
            SignupRequestDTO request
    ) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateRequestException("Email already exists");
        }

        University university = universityRepository.findById(request.getUniversityId())
                .orElseThrow(() -> new EntityNotFoundException("University not found"));

        Faculty faculty = facultyRepository.findById(request.getFacultyId())
                .orElseThrow(() -> new EntityNotFoundException("Faculty not found"));


        User user = authMapper.toUser(request, university, faculty);

        String verificationToken = generateVerificationToken();
        user.setVerificationToken(verificationToken);
        user.setIsVerified(false);

        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), verificationToken);
    }

    public void verifyEmail(
            String token
    ) {
        User user = userRepository.findByVerificationToken(token);

        if (user == null) {
            throw new EntityNotFoundException("User not found with verification token: " + token);
        }

        if (Boolean.TRUE.equals(user.getIsVerified())) {
            throw new DuplicateRequestException("Email already verified");
        }

        user.setVerificationToken(null);
        user.setIsVerified(true);
        userRepository.save(user);
    }

    public AuthResponseDTO login(
            LoginRequestDTO request
    ) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        if (!authentication.isAuthenticated()) {
            throw new BadCredentialsException("Invalid credentials");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User not found with email: " + request.getEmail()));

        if (!Boolean.TRUE.equals(user.getIsVerified())) {
            throw new AccessDeniedException("Please verify your email before logging in!");
        }

        String token = jwtService.generateToken(user);

        AuthUserDTO authUserDTO = authMapper.toAuthUserDTO(user);

        return authMapper.toAuthResponseDTO(token, authUserDTO);
    }

    private String generateVerificationToken() {
        return UUID.randomUUID().toString();
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
}
