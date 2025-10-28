package com.majestor.api.modules.user.dto;

import com.majestor.api.modules.user.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetUserDetailsResponseDTO {
    private Long id;
    private String name;
    private byte[] avatar;
    private String email;
    private String phone;
    private String personalEmail;
    private String university;
    private String faculty;
    private List<Role> roles;
    private LocalDateTime createdAt;
}
