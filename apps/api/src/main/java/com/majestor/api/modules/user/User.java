package com.majestor.api.modules.user;

import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.academia.university.University;
import com.majestor.api.modules.lostfound.founder.Founder;
import com.majestor.api.modules.lostfound.lostitem.LostItem;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Username is required")
    @Size(min = 2, max = 20, message = "Username must be greater than 2 and less than 20 characters")
    @Column(unique = true)
    private String username;

    @NotBlank(message = "Password is required")
    private String passwordHash;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @Email(message = "Invalid email address")
    private String personalEmail;

    private String avatar;

    @NotEmpty(message = "At least one user role is required")
    @ElementCollection(targetClass = Role.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    private List<Role> roles = new ArrayList<>();

    @NotNull(message = "University is required")
    @ManyToOne
    @JoinColumn(name = "university_id")
    private University university;

    @NotNull(message = "Faculty is required")
    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Faculty faculty;

    @OneToMany(mappedBy = "owner")
    private List<LostItem> lostItems;

    @OneToMany(mappedBy = "founder")
    private List<Founder> founders;

    // For email-based verification
    private String verificationToken;
    private Boolean isVerified;
    @Column(name = "reset_token")
    private String resetToken;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
