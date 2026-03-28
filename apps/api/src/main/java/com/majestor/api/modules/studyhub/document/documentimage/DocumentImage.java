package com.majestor.api.modules.studyhub.document.documentimage;

import com.majestor.api.modules.studyhub.document.Document;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;


@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(
        name = "document_images",
        indexes = {
                @Index(name = "idx_document_id", columnList = "document_id")
        }
)
public class DocumentImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotEmpty(message = "Image URI is required")
    private String imageUri;

    @Column(nullable = false)
    @NotEmpty(message = "File extension is required")
    private String fileExtension;

    @Column(nullable = false)
    @NotNull(message = "Serial number is required")
    @Positive(message = "Serial number must be a positive number")
    private Long serialNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;

    private Instant createdAt;
    private Instant updatedAt;
}
