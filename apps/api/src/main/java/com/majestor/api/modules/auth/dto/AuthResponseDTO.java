package com.majestor.api.modules.auth.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponseDTO {
    String token;
    AuthUserDTO authUserDTO;
}
