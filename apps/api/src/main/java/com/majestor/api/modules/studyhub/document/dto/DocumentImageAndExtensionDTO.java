package com.majestor.api.modules.studyhub.document.dto;

import com.majestor.api.modules.studyhub.document.documentimage.DocumentImage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DocumentImageAndExtensionDTO {
    @NotNull(message = "Document image is required")
    private DocumentImage documentImage;

    @NotBlank(message = "File extension is required")
    private String fileExtension;
}
