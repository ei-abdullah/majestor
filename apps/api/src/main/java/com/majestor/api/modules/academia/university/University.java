package com.majestor.api.modules.academia.university;

import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.user.User;
import jakarta.persistence.*;
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

    private String name;
    private String address;

    @OneToMany(mappedBy = "universityFaculties")
    private List<Faculty> faculties;

    @OneToMany(mappedBy = "university")
    private List<User> students;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
