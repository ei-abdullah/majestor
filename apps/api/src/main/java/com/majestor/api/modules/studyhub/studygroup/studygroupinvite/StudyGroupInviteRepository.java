package com.majestor.api.modules.studyhub.studygroup.studygroupinvite;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudyGroupInviteRepository extends JpaRepository<StudyGroupInvite, Long> {

    Optional<StudyGroupInvite> findByInviteeIdAndInviteeStudyGroupIdAndStatus(Long inviteeId, Long groupId, StudyGroupInviteStatus status);

    boolean existsByInviteeIdAndInviteeStudyGroupIdAndStatus(Long inviteeId, Long groupId, StudyGroupInviteStatus status);
}
