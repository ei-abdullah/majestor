package com.majestor.api.modules.user;

import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.academia.university.University;
import com.majestor.api.modules.carpool.ride.Ride;
import com.majestor.api.modules.carpool.rideRequest.RideRequest;
import com.majestor.api.modules.notification.Notification;
import com.majestor.api.modules.studyhub.document.Document;
import com.majestor.api.modules.studyhub.document.like.Like;
import com.majestor.api.modules.studyhub.studygroup.rating.Rating;
import com.majestor.api.modules.studyhub.studygroup.StudyGroup;
import com.majestor.api.modules.studyhub.studygroup.studygroupinvite.StudyGroupInvite;
import com.majestor.api.modules.studyhub.studygroup.studygroupmember.StudyGroupMember;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.Instant;
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
                @Index(name = "idx_user_email", columnList = "email"),
                @Index(name="idx_user_id", columnList = "id")
        }
)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @Column(nullable = false)
    @NotNull(message = "User type is required")
    private Boolean isFaculty;

    private Instant premiumUntil;

    @Builder.Default
    @Column(nullable = false)
    private Integer carpoolStrikeCount = 0;

    private Instant carpoolSuspendedUntil;

    @Builder.Default
    @Column(nullable = false)
    @NotNull(message = "Storage used is required")
    private Long storageUsed = 0L;

    @Builder.Default
    @Column(nullable = false)
    @NotNull(message = "Storage limit is required")
    private Long storageLimit = 100L * 1024 * 1024;  // 100 MBs

    @Column(name = "expo_push_token")
    private String expoPushToken;

    @Builder.Default
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
    private Faculty faculty;

    @OneToMany(mappedBy = "uploader", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents;

    @OneToMany(mappedBy = "likedBy", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes;

    @OneToMany(mappedBy = "ridePoster", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ride> postedRides;

    @OneToMany(mappedBy = "rideRequester", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RideRequest> rideRequests;

    @OneToMany(mappedBy = "studyGroupHost")
    private List<StudyGroup> hostedStudyGroups;

    @OneToMany(mappedBy = "studyGroupMember")
    private List<StudyGroupMember>  joinedStudyGroups;

    @OneToMany(mappedBy = "sender")
    private List<Notification> sentNotifications;

    @OneToMany(mappedBy = "recipient")
    private List<Notification> receivedNotifications;

    @OneToMany(mappedBy = "ratedBy")
    private List<Rating> ratedStudyGroups;

    @OneToMany(mappedBy = "inviter")
    private List<StudyGroupInvite> groupInvites;

    @OneToMany(mappedBy = "invitee")
    private List<StudyGroupInvite> groupInvitesReceived;

    // For email-based verification
    private String verificationToken;

    @Builder.Default
    @Column(name = "is_verified", nullable = false)
    private Boolean isVerified = false;

    @Column(name = "reset_token")
    private String resetToken;

    private Instant createdAt;
    private Instant updatedAt;

    @Transient
    public Boolean isElite() {
        return this.premiumUntil != null && this.premiumUntil.isAfter(Instant.now());
    }

    @Transient
    public Boolean isCarpoolSuspended() {
        return this.carpoolSuspendedUntil != null && this.carpoolSuspendedUntil.isAfter(Instant.now());
    }
}
