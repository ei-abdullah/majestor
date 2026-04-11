package com.majestor.api.modules.auth.dto;

import com.majestor.api.modules.user.Role;
import jakarta.persistence.Column;
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

    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @Email(message = "Invalid email address")
    private String personalEmail;

    @NotNull(message = "User type is required")
    private Boolean isFaculty;

    private Instant premiumUntil;

    @NotNull(message = "Storage used by user is required")
    @PositiveOrZero(message = "Storage used must be positive or zero")
    private Long storageUsed;

    @NotNull(message = "Storage limit must be defined")
    @PositiveOrZero(message = "Storage limit must be positive or zero")
    private Long storageLimit;

    @NotNull(message = "University ID is required")
    @Positive(message = "University ID must be a positive number")
    private Long universityId;

    @NotBlank(message = "University name is required")
    private String university;

    @NotNull(message = "Faculty ID is required")
    @Positive(message = "Faculty ID must be a positive number")
    private Long facultyId;

    @NotBlank(message = "Faculty name is required")
    private String faculty;

    @NotEmpty(message = "Roles are required")
    private List<Role> roles;

    @NotNull(message = "User creation date is required")
    private Instant createdAt;

    @NotNull(message = "User updated data is required")
    private Instant updatedAt;
}
