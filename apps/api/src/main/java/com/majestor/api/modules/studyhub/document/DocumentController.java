package com.majestor.api.modules.studyhub.document;

import com.majestor.api.modules.studyhub.document.dto.DocumentUploadRequestDTO;
import com.majestor.api.modules.studyhub.document.dto.GetAllDocumentsDTO;
import com.majestor.api.modules.studyhub.document.dto.GetAllDocumentsFiltersDTO;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/v1/document")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(
            value = "/uploadDocument/{userId}",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<?> uploadDocument(
            @Valid @ModelAttribute DocumentUploadRequestDTO documentUploadRequestDTO,
            @PathVariable @NotNull @Positive Long userId
    ) {
        documentService.uploadDocument(documentUploadRequestDTO, userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    // /getAllDocuments?courseTitle="CA"&year=2019&documentType=1&sortByLikes=FALSE
    @GetMapping("/getAllDocuments/{userId}")
    public ResponseEntity<List<GetAllDocumentsDTO>> getAllDocuments(
            @Valid @ModelAttribute GetAllDocumentsFiltersDTO getAllDocumentsFiltersDTO,
            @PathVariable @NotNull @Positive Long userId
    ) {
        List<GetAllDocumentsDTO> response = documentService.getAllDocuments(userId, getAllDocumentsFiltersDTO);

        return ResponseEntity
                .ok()
                .body(response);
    }

    @PatchMapping("/likeDocument/{userId}/{documentId}")
    public ResponseEntity<?> likeDocument(
            @PathVariable @NotNull @Positive Long userId,
            @PathVariable @NotNull @Positive Long documentId
    ) {
        documentService.likeDocument(userId, documentId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/downloadDocument/{userId}/{documentId}")
    public ResponseEntity<?> downloadDocument(
            @PathVariable @NotNull @Positive Long userId,
            @PathVariable @NotNull @Positive Long documentId,
            HttpServletResponse response
    ) {
        documentService.downloadDocument(userId, documentId, response);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}
