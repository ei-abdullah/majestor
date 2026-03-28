package com.majestor.api.modules.studyhub.studygroup;

import com.majestor.api.modules.academia.course.Course;
import com.majestor.api.modules.studyhub.document.Document;
import com.majestor.api.modules.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
@Table(name = "study_groups")
public class StudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Study group name is required")
    private String name;

    @Builder.Default
    @Column(nullable = false)
    @NotNull(message = "Study group official status is required")
    private Boolean isOfficial = false;

    @Builder.Default
    @Column(nullable = false)
    @NotNull(message = "Study group active status is required")
    private Boolean isActive = true;

    @Builder.Default
    @Column(nullable = false)
    @NotNull(message = "Study group popularity score is required")
    private Long popularityScore = 0L;

    @OneToMany(mappedBy = "documentStudyGroup")
    private List<Document> studyGroupDocuments;

    @ManyToOne
    @JoinColumn(name = "study_group_host")
    private User studyGroupHost;

    @OneToMany(mappedBy = "studyGroup")
    private List<StudyGroupMember> studyGroupMembers;

    @ManyToOne
    @JoinColumn(name = "study_group_course")
    private Course studyGroupCourse;

    @OneToMany(mappedBy = "ratedStudyGroup")
    private List<Rating> ratings;

    private Instant createdAt;
    private Instant updatedAt;
}
