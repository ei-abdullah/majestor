package com.majestor.api.modules.document;

import com.majestor.api.modules.academia.course.Course;
import com.majestor.api.modules.document.documentimage.DocumentImage;
import com.majestor.api.modules.document.like.Like;
import com.majestor.api.modules.user.User;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(
        name = "documents",
        indexes = {
                @Index(name = "idx_uploader_id", columnList = "uploader_id")
        }
)
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Document title is required")
    private String title;

    @Column(nullable = false)
    @NotNull(message = "Documents uploaded year is required")
    @Positive
    private Long uploadedYear;

    @Valid
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DocType documentType;

    @Valid
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private SemType semesterType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploader_id", nullable = false)
    private User uploader;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @OneToMany(mappedBy = "document", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DocumentImage> documentImages;

    @OneToMany(mappedBy = "likedDocument", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes;

    private Instant createdAt;
    private Instant updatedAt;
}
