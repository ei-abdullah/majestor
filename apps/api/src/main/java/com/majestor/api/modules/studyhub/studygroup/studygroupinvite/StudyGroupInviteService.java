package com.majestor.api.modules.studyhub.studygroup.studygroupinvite;

import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.modules.notification.NotificationService;
import com.majestor.api.modules.notification.NotificationType;
import com.majestor.api.modules.studyhub.studygroup.StudyGroup;
import com.majestor.api.modules.studyhub.studygroup.StudyGroupRepository;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.Instant;

@Slf4j
@Service
@Validated
@RequiredArgsConstructor
public class StudyGroupInviteService {

    private final StudyGroupInviteRepository studyGroupInviteRepository;
    private final UserRepository userRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final NotificationService notificationService;

    @Transactional
    public void sendInvite(Long groupId, Long inviterId, Long inviteeId) {
        User inviter = userRepository.findById(inviterId)
                .orElseThrow(() -> new ResourceNotFoundException("Inviter not found with id: " + inviterId));

        User invitee = userRepository.findById(inviteeId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitee not found with id: " + inviteeId));

        StudyGroup studyGroup = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Study Group not found with id: " + groupId));

        StudyGroupInvite invite = StudyGroupInvite
                .builder()
                .inviteeStudyGroup(studyGroup)
                .inviter(inviter)
                .invitee(invitee)
                .status(StudyGroupInviteStatus.PENDING)
                .createdAt(Instant.now())
                .build();

        studyGroupInviteRepository.save(invite);

        notificationService.sendNotification(
                invitee,
                inviter,
                NotificationType.STUDY_GROUP_INVITE,
                "Group Invitation",
                inviter.getUsername() + " invited you to join " + studyGroup.getName(),
                groupId
        );
    }

    @Transactional
    public void acceptInvite(Long inviteId) {
        StudyGroupInvite invite = studyGroupInviteRepository.findById(inviteId)
                .orElseThrow(() -> new ResourceNotFoundException("Invite not found with id: " + inviteId));

        invite.setStatus(StudyGroupInviteStatus.ACCEPTED);
        studyGroupInviteRepository.save(invite);
    }

    @Transactional
    public void rejectInvite(Long inviteId) {
        StudyGroupInvite invite = studyGroupInviteRepository.findById(inviteId)
                .orElseThrow(() -> new ResourceNotFoundException("Invite not found with id: " + inviteId));

        invite.setStatus(StudyGroupInviteStatus.REJECTED);
        studyGroupInviteRepository.save(invite);
    }
}
