package com.majestor.api.modules.auth.dto;

import com.majestor.api.modules.user.Role;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class AuthUserDTO {
    @NotNull(message = "User ID is required")
    @Positive(message = "User ID must be a positive number")
    private Long id;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Username is required")
    @Size(min = 2, max = 20, message = "Username must be greater than 2 and less than 20 characters")
    private String username;

    @NotNull(message = "User onboarding status is required")
    private Boolean hasOnboarded;

    @NotNull(message = "University ID is required")
    @Positive(message = "University ID must be a positive number")
    private Long universityId;

    @NotNull(message = "Faculty ID is required")
    @Positive(message = "Faculty ID must be a positive number")
    private Long facultyId;

    @NotNull(message = "Storage used by user is required")
    @PositiveOrZero(message = "Storage used must be positive or zero")
    private Long totalStorageUsed;

    @NotNull(message = "Storage limit must be defined")
    @PositiveOrZero(message = "Storage limit must be positive or zero")
    private Long storageLimit;

    @NotNull(message = "User's premium timeline is required")
    private Instant premiumUntil;

    @NotNull(message = "isFaculty is required")
    private Boolean isFaculty;

    @NotEmpty(message = "Roles are required")
    private List<Role> roles;
}
