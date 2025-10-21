package com.majestor.api.modules.auth.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class SignupRequestDTO {
    String email;
    String password;
    String username;
    String phone;
    Long universityId;
    Long facultyId;
}
