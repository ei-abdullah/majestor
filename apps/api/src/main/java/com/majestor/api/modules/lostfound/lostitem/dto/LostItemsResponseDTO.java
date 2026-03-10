package com.majestor.api.modules.lostfound.lostitem.dto;

import com.majestor.api.modules.lostfound.lostitem.Status;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LostItemsResponseDTO {
    @NotNull(message = "ID is required")
    @Positive(message = "ID must be a positive number")
    private Long id;

    @NotEmpty(message = "Lost item title is required")
    @Size(max = 100, message = "Lost item's title must be less than 100 characters")
    private String title;

    @NotNull(message = "Lost item status is required")
    private Status status;

    @NotNull(message = "OwnerID is required")
    @Positive(message = "OwnerID must be a positive number")
    private Long ownerId;

    @NotEmpty(message = "Owner email is required")
    @Email(message = "Invalid email address")
    private String ownerEmail;

    @NotNull(message = "First image of lost items is required")
    private String lostItemImageUri;

    @NotNull(message = "Created at is required")
    private Instant createdAt;
}
