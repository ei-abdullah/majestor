package com.majestor.api.modules.user.dto;

import com.majestor.api.modules.user.Role;
import jakarta.validation.constraints.*;
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
    @NotNull(message = "ID is required")
    @Positive(message = "ID must be a positive number")
    private Long id;

    @NotBlank(message = "Username is required")
    private String username;

    @NotNull(message = "Avatar is required")
    private String avatar;

    @NotBlank(message = "Email is required")
    @Pattern(
            regexp = "^[a-zA-Z0-9._%+-]+@cust\\.pk$",
            message = "Invalid email address"
    )
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

    @NotEmpty(message = "User must have at least one role")
    private List<Role> roles;

    @NotNull(message = "Creation time is required")
    private LocalDateTime createdAt;

}
