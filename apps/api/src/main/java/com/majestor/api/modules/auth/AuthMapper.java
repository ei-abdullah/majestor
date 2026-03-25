package com.majestor.api.modules.auth;

import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.academia.university.University;
import com.majestor.api.modules.auth.dto.AuthResponseDTO;
import com.majestor.api.modules.auth.dto.AuthUserDTO;
import com.majestor.api.modules.auth.dto.SignupRequestDTO;
import com.majestor.api.modules.user.Role;
import com.majestor.api.modules.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AuthMapper {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public AuthUserDTO toAuthUserDTO(User user) {
        if (user == null) {
            throw new IllegalStateException("User is null");
        }
        if (user.getUniversity() == null) {
            throw new IllegalStateException("University is null for student: " + user.getId());
        }
        if (user.getFaculty() == null) {
            throw new IllegalStateException("Faculty is null for student: " + user.getId());
        }

        return AuthUserDTO
                .builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .hasOnboarded(user.getHasOnboarded())
                .universityId(user.getUniversity().getId())
                .facultyId(user.getFaculty().getId())
                .isFaculty(user.getIsFaculty())
                .roles(user.getRoles())
                .build();
    }

    public AuthResponseDTO toAuthResponseDTO(String accessToken, String refreshToken, AuthUserDTO authUserDTO) {
        return AuthResponseDTO
                .builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .authUserDTO(authUserDTO)
                .build();
    }

    public User toUser(SignupRequestDTO request, University university, Faculty faculty, List<Role> roles) {
        return User
                .builder()
                .email(request.getEmail().trim().toLowerCase())
                .username(request.getUsername())
                .passwordHash(bCryptPasswordEncoder.encode(request.getPassword()))
                .hasOnboarded(Boolean.FALSE)
                .university(university)
                .faculty(faculty)
                .isFaculty(request.getIsFaculty())
                .roles(roles)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    public User toUser(SignupRequestDTO request, University university, Faculty faculty) {
        Boolean isFaculty = request.getIsFaculty();

        if (isFaculty) {
            return toUser(request, university, faculty, List.of(Role.FACULTY));
        }

        return toUser(request, university, faculty, List.of(Role.STUDENT));
    }
}
