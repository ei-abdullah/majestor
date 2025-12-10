package com.majestor.api.modules.document.dto;

import com.majestor.api.modules.document.DocType;
import com.majestor.api.modules.document.SemType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DocumentUploadRequestDTO {
    @NotBlank(message = "Document title is required")
    private String title;

    @NotNull(message = "Document type is required")
    private DocType documentType;

    @NotNull(message = "Semester type is required")
    private SemType semesterType;

    @NotNull(message = "Document uploaded year is required")
    private Long uploadedYear;

    @NotNull(message = "Document course is required")
    @Positive(message = "Course ID must be positive")
    private Long courseId;

    @NotEmpty(message = "Document images are required")
    private MultipartFile[] documentImages;
}
