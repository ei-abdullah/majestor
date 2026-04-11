package com.majestor.api.modules.studyhub.studygroup.studygroupinvite;

import com.majestor.api.modules.studyhub.studygroup.StudyGroup;
import com.majestor.api.modules.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "study_group_invites")
public class StudyGroupInvite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private StudyGroupInviteStatus status = StudyGroupInviteStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "study_group_id", nullable = false)
    private StudyGroup inviteeStudyGroup;

    @ManyToOne
    @JoinColumn(name =  "inviter_id", nullable = false)
    private User inviter;

    @ManyToOne
    @JoinColumn(name = "invitee_id", nullable = false)
    private User invitee;

    private Instant createdAt;
    private Instant updatedAt;
}
