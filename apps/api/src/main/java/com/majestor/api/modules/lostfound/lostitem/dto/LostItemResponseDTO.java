package com.majestor.api.modules.lostfound.lostitem.dto;

import com.majestor.api.modules.lostfound.lostitem.Status;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LostItemResponseDTO {
    @NotNull(message = "ID is required")
    @Positive(message = "ID must be a positive number")
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(max = 100, message = "Title must be greater than 2 and less than 100 characters")
    private String title;

    @NotNull(message = "Status is required")
    private Status status;

    @NotNull(message = "OwnerID is required")
    @Positive(message = "OwnerID must be a positive number")
    private Long ownerId;

    @NotEmpty(message = "Lost item image is required")
    private String imageUri;

    @NotNull(message = "Created at is required")
    private LocalDateTime createdAt;
}
