package com.majestor.api.modules.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class LoginRequestDTO {
    @NotBlank(message = "Email is required")
    @Pattern(
            regexp = "^[a-zA-Z0-9._%+-]+@cust\\.pk$",
            message = "Invalid email address"
    )
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
