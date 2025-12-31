package com.majestor.api.modules.document.dto;

import com.majestor.api.modules.document.DocType;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// /getAllDocuments?courseTitle="CA"&year=2019&documentType=1&sortByLikes=FALSE

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetAllDocumentsFiltersDTO {
    private String searchQuery;

    @Positive(message = "Year must be a positive number")
    private Long year;

    private String docType;

    private Boolean sortByLikes;
}
