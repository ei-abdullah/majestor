package com.majestor.api.modules.studyhub.studygroup.studygroupmember;

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
@Table(name = "study_group_members")
public class StudyGroupMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "study_group_id", nullable = false)
    private StudyGroup studyGroup;

    @ManyToOne
    @JoinColumn(name = "group_member_id", nullable = false)
    private User studyGroupMember;

    private Instant joinedAt;
    private Instant leftAt;
}
