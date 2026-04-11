package com.majestor.api.modules.user.dto;

import com.majestor.api.modules.user.Role;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetUserDetailsResponseDTO {
    @NotNull(message = "ID is required")
    @Positive(message = "ID must be a positive number")
    private Long id;

    @NotBlank(message = "Username is required")
    private String username;

    @NotNull(message = "Avatar is required")
    private String avatar;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @NotBlank(message = "Personal email is required")
    @Email(message = "Invalid email format")
    private String personalEmail;

    @NotBlank(message = "University name is required")
    private String university;

    @NotBlank(message = "Faculty name is required")
    private String faculty;

    private Instant premiumUntil;

    @NotNull(message = "Storage used is required")
    private Long storageUsed;

    @NotNull(message = "Storage limit is required")
    private Long storageLimit;

    @NotEmpty(message = "User must have at least one role")
    private List<Role> roles;

    @NotNull(message = "Onboarding status is required")
    private Boolean hasOnboarded;

    @NotNull(message = "Is faculty status is required")
    private Boolean isFaculty;

    @NotNull(message = "Creation time is required")
    private Instant createdAt;

}
