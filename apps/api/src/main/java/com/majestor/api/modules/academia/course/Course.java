package com.majestor.api.modules.academia.course;

import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.studyhub.document.Document;
import com.majestor.api.modules.studyhub.studygroup.StudyGroup;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank
    private String name;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> document;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "faculty_id", nullable = false)
    private Faculty facultyCourses;

    @OneToMany(mappedBy = "studyGroupCourse")
    private List<StudyGroup> courseStudyGroups;

    private Instant createdAt;
    private Instant updatedAt;
}
