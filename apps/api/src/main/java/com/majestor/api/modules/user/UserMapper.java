package com.majestor.api.modules.user;

import com.majestor.api.modules.user.dto.GetUserDetailsResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public GetUserDetailsResponseDTO toGetUserDetailsResponseDTO(User user, String avatar) {
        return GetUserDetailsResponseDTO
                .builder()
                .id(user.getId())
                .username(user.getUsername())
                .avatar(avatar)
                .email(user.getEmail())
                .phone(user.getPhone())
                .personalEmail(user.getPersonalEmail())
                .university(user.getUniversity().getName())
                .faculty(user.getFaculty().getName())
                .roles(user.getRoles())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
