package com.majestor.api.modules.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class SignupRequestDTO {
    @NotBlank(message = "Username is required")
    @Size(min = 2, max = 20, message = "Username must be greater than 2 and less than 20 characters")
    private String username;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Signer status is required")
    private Boolean isFaculty;

    @NotNull(message = "University ID is required")
    @Positive(message = "University ID must be a positive number")
    private Long universityId;

    @NotNull(message = "Faculty ID is required")
    @Positive(message = "Faculty ID must be a positive number")
    private Long facultyId;
}
