package com.majestor.api.modules.auth.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDTO {
    @NotBlank(message = "Token is required")
    private String token;

    @NotNull(message = "Auth user is required")
    @Valid
    private AuthUserDTO authUserDTO;
}
