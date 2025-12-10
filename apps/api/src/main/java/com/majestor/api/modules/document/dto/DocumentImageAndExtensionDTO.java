package com.majestor.api.modules.document.dto;

import com.majestor.api.modules.document.documentimage.DocumentImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DocumentImageAndExtensionDTO {
    private DocumentImage documentImage;
    private String fileExtension;
}
