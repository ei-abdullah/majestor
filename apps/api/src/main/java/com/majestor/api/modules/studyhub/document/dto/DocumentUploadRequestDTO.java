package com.majestor.api.modules.studyhub.document.dto;

import com.majestor.api.modules.studyhub.document.DocType;
import com.majestor.api.modules.studyhub.document.DocumentDestination;
import com.majestor.api.modules.studyhub.document.SemType;
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

    private Long courseId;

    private Long studyGroupId;

    @NotNull(message = "Destination is required")
    private DocumentDestination destination;

    @Builder.Default
    private Boolean isPremiumOnly = true;

    @NotEmpty(message = "Document images are required")
    private MultipartFile[] documentImages;
}
