package com.majestor.api.modules.studyhub.document.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VaultDocumentDTO {

    @NotNull(message = "Document ID is required")
    private Long id;

    @NotNull(message = "Document title is required")
    private String title;

    @NotNull(message = "Document uploaded year is required")
    private Long year;

    @NotNull(message = "Document type is required")
    private String documentType;

    @NotNull(message = "Semester type is required")
    private String semesterType;

    @NotNull(message = "Course is required")
    private String course;

    @NotNull(message = "Document image is required")
    private String imageUri;

    @NotNull(message = "Likes count is required")
    private long likesCount;

}
