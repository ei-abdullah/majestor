package com.majestor.api.modules.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class RefreshRequestDTO {
    @NotBlank(message = "Refresh token is required")
    private String refreshToken;
}
