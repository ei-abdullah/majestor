package com.majestor.api.modules.auth.dto;

import com.majestor.api.modules.user.Role;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AuthUserDTO {
    Long id;
    String email;
    String username;
    Long universityId;
    Long facultyId;
    List<Role> roles;
}
