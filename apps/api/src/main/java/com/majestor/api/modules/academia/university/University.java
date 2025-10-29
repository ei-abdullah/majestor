package com.majestor.api.modules.academia.university;

import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
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
@Table(name = "universities")
@EqualsAndHashCode(exclude = {"faculties", "students"})
@ToString(exclude = {"faculties", "students"})
public class University {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "University name is required")
    @Size(max = 100, message = "University name must be less than 100 characters")
    private String name;

    @NotBlank(message = "University address is required")
    @Size(max = 255, message = "University address must be less than 255 characters")
    private String address;

    @NotEmpty(message = "University faculties are required")
    @OneToMany(mappedBy = "universityFaculties")
    private List<Faculty> faculties;

    @OneToMany(mappedBy = "university")
    private List<User> students;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
