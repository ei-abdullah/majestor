package com.majestor.api.modules.lostfound.lostitem.dto;

import com.majestor.api.modules.lostfound.shared.LastLocation;
import jakarta.validation.Valid;
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
public class LostItemAndFoundersResponseDTO {

    @NotNull(message = "ID is required")
    @Positive(message = "ID must be a positive number")
    private Long id;

    @NotNull(message = "Owner ID is required")
    @Positive(message = "OwnerID must be a positive number")
    private Long ownerId;

    @NotNull(message = "Owner email is required")
    private String ownerEmail;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 255, message = "Description must be less than 255 characters")
    private String description;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @NotBlank(message = "Last location description is required")
    @Size(max = 255, message = "Last location description must be less than 255 characters")
    private String lastLocationDescription;

    @NotNull(message = "Last location is required")
    @Valid
    private LastLocation lastLocation;

    @NotEmpty(message = "Lost item images are required")
    private List<String> lostItemImageUris;

    @NotEmpty(message = "Lost item founders are required")
    private List<LostItemAndFoundersDTO> itemFounders;

    @NotNull(message = "Created at is required")
    private LocalDateTime createdAt;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LostItemAndFoundersDTO {
        @NotNull(message = "ID is required")
        @Positive(message = "ID must be a positive number")
        private Long id;

        @NotBlank(message = "Username is required")
        @Size(max = 50, message = "Username must be less than 100 characters")
        private String username;

        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
        private String phone;

        @NotBlank(message = "Founder email is required")
        private String founderEmail;

        @NotBlank(message = "Found location is required")
        @Size(max = 255, message = "Found location description must be less than 255 characters")
        private String foundLocationDescription;

        @Valid
        private LastLocation lastLocation;

        @NotEmpty(message = "Found item images are required")
        private List<String> foundItemImageUris;

        @NotNull(message = "Created at is required")
        private LocalDateTime createdAt;
    }
}
