package com.majestor.api.modules.academia.faculty;

import com.majestor.api.modules.academia.university.University;
import com.majestor.api.modules.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "faculties")
@EqualsAndHashCode(exclude = {"universityFaculties", "students"})
@ToString(exclude = {"universityFaculties", "students"})
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

    @OneToMany(mappedBy = "faculty")
    private List<User> students;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
