package com.majestor.api.modules.academia.faculty;

import com.majestor.api.modules.academia.course.Course;
import com.majestor.api.modules.academia.university.University;
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
@Table(name = "faculties")
public class Faculty {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "University must be linked")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "university_id", nullable = false)
    private University universityFaculties;

    @OneToMany(mappedBy = "studentFaculty")
    private List<User> students;

    @OneToMany(mappedBy = "facultyCourses")
    private List<Course> courses;

    private Instant createdAt;
    private Instant updatedAt;
}
