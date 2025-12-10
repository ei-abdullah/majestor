package com.majestor.api.modules.document;

import com.majestor.api.modules.document.dto.DocumentUploadRequestDTO;
import com.majestor.api.modules.document.dto.GetAllDocumentsDTO;
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
            @PathVariable("userId") @NotNull @Positive Long userId
    ) {
        documentService.uploadDocument(documentUploadRequestDTO, userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .build();
    }

    @GetMapping("/getAllDocuments/{userId}")
    public ResponseEntity<List<GetAllDocumentsDTO>> getAllDocuments(
            @PathVariable("userId") @NotNull @Positive Long userId
    ) {
        List<GetAllDocumentsDTO> response = documentService.getAllDocuments(userId);

        return ResponseEntity
                .ok()
                .body(response);
    }

    @PatchMapping("/likeDocument/{userId}/{documentId}")
    public ResponseEntity<?> likeDocument(
            @PathVariable("userId") @NotNull @Positive Long userId,
            @PathVariable("documentId") @NotNull @Positive Long documentId
    ) {
        documentService.likeDocument(userId, documentId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/downloadDocument/{documentId}")
    public ResponseEntity<?> downloadDocument(
            @PathVariable("documentId") @NotNull @Positive Long documentId,
            HttpServletResponse response
    ) {
        documentService.downloadDocument(documentId, response);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }
}
