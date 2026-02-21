package com.majestor.api.modules.user;

import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.academia.university.University;
import com.majestor.api.modules.carpool.ride.Ride;
import com.majestor.api.modules.carpool.rideRequest.RideRequest;
import com.majestor.api.modules.document.Document;
import com.majestor.api.modules.document.like.Like;
import com.majestor.api.modules.lostfound.founder.Founder;
import com.majestor.api.modules.lostfound.lostitem.LostItem;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(
        name = "users",
        indexes = {
                @Index(name = "idx_user_email", columnList = "email")
        }
)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Username is required")
    @Size(min = 2, max = 20, message = "Username must be greater than 2 and less than 20 characters")
    private String username;

    @Column(nullable = false)
    @NotBlank(message = "Password is required")
    private String passwordHash;

    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @Email(message = "Invalid email address")
    private String personalEmail;

    private String avatar;

    private Boolean hasOnboarded;

    @NotEmpty(message = "At least one user role is required")
    @ElementCollection(targetClass = Role.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "role")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Role> roles = new ArrayList<>();

    @NotNull(message = "University is required")
    @ManyToOne
    @JoinColumn(name = "university_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private University university;

    @NotNull(message = "Faculty is required")
    @ManyToOne
    @JoinColumn(name = "faculty_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Faculty studentFaculty;

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<LostItem> lostItems;

    @OneToMany(mappedBy = "founder", cascade = CascadeType.ALL, orphanRemoval = true)
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private List<Founder> founders;

    @OneToMany(mappedBy = "uploader", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents;

    @OneToMany(mappedBy = "likedBy", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes;

    @OneToMany(mappedBy = "ridePoster", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ride> postedRides;

    @OneToMany(mappedBy = "rideRequester", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RideRequest> rideRequests;

    // For email-based verification
    private String verificationToken;

    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @Column(name = "reset_token")
    private String resetToken;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
