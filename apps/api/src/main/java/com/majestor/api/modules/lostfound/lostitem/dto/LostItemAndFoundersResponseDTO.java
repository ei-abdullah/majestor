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

    @NotNull(message = "OwnerID is required")
    @Positive(message = "OwnerID must be a positive number")
    private Long ownerId;

    @NotBlank(message = "OwnerEmail is required")
    @Size(max = 100, message = "OwnerEmail must be less than 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 255, message = "Description must be less than 255 characters")
    private String description;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @NotBlank(message = "Found location is required")
    @Size(max = 255, message = "Last location description must be less than 255 characters")
    private String lastLocationDescription;

    @NotEmpty(message = "Lost item founders are required")
    private List<LostItemAndFoundersDTO> itemFounders;

    @NotEmpty(message = "Lost item images are required")
    private List<byte[]> lostItemImages;

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

        @NotBlank(message = "Name is required")
        @Size(max = 50, message = "Name must be less than 100 characters")
        private String name;

        @NotBlank(message = "Phone is required")
        @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
        private String phone;

        @NotBlank(message = "Found location is required")
        @Size(max = 255, message = "Found location description must be less than 255 characters")
        private String foundLocationDescription;

        @Valid
        private LastLocation lastLocation;

        @NotEmpty(message = "Found item images are required")
        private List<byte[]> foundItemImages;

        @NotNull(message = "Created at is required")
        private LocalDateTime createdAt;
    }
}
