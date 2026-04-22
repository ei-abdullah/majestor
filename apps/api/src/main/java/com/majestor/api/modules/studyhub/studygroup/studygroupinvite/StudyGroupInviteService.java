package com.majestor.api.modules.studyhub.studygroup.studygroupinvite;

import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.modules.notification.NotificationRepository;
import com.majestor.api.modules.notification.NotificationService;
import com.majestor.api.modules.notification.NotificationType;
import com.majestor.api.modules.studyhub.studygroup.StudyGroup;
import com.majestor.api.modules.studyhub.studygroup.StudyGroupRepository;
import com.majestor.api.modules.studyhub.studygroup.studygroupinvite.dto.PendingInviteDTO;
import com.majestor.api.modules.studyhub.studygroup.studygroupmember.StudyGroupMember;
import com.majestor.api.modules.studyhub.studygroup.studygroupmember.StudyGroupMemberRepository;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Validated
@RequiredArgsConstructor
public class StudyGroupInviteService {

    private final StudyGroupInviteRepository studyGroupInviteRepository;
    private final UserRepository userRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final StudyGroupMemberRepository studyGroupMemberRepository;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    @Transactional
    public void sendInvite(Long groupId, Long inviterId, Long inviteeId) {
        User inviter = userRepository.findById(inviterId)
                .orElseThrow(() -> new ResourceNotFoundException("Inviter not found with id: " + inviterId));

        User invitee = userRepository.findById(inviteeId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitee not found with id: " + inviteeId));

        StudyGroup studyGroup = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Study Group not found with id: " + groupId));

        boolean alreadyPending = studyGroupInviteRepository
                .existsByInviteeIdAndInviteeStudyGroupIdAndStatus(inviteeId, groupId, StudyGroupInviteStatus.PENDING);

        if (alreadyPending) {
            return;
        }

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
                invite.getId()
        );
    }

    @Transactional
    public void acceptInvite(Long inviteId) {
        StudyGroupInvite invite = studyGroupInviteRepository.findById(inviteId)
                .orElseThrow(() -> new ResourceNotFoundException("Invite not found with id: " + inviteId));

        invite.setStatus(StudyGroupInviteStatus.ACCEPTED);
        studyGroupInviteRepository.save(invite);

        StudyGroup group = invite.getInviteeStudyGroup();
        User invitee = invite.getInvitee();

        boolean alreadyMember = studyGroupMemberRepository
                .findActiveMembership(invitee.getId(), group.getId()).isPresent();

        if (!alreadyMember) {
            studyGroupMemberRepository.save(
                    StudyGroupMember.builder()
                            .studyGroup(group)
                            .studyGroupMember(invitee)
                            .joinedAt(Instant.now())
                            .build()
            );
        }

        notificationRepository.findByRelatedIdAndNotificationType(invite.getId(), NotificationType.STUDY_GROUP_INVITE)
                .ifPresent(n -> { n.setResponse("ACCEPTED"); notificationRepository.save(n); });
    }

    @Transactional
    public void rejectInvite(Long inviteId) {
        StudyGroupInvite invite = studyGroupInviteRepository.findById(inviteId)
                .orElseThrow(() -> new ResourceNotFoundException("Invite not found with id: " + inviteId));

        invite.setStatus(StudyGroupInviteStatus.REJECTED);
        studyGroupInviteRepository.save(invite);

        notificationRepository.findByRelatedIdAndNotificationType(invite.getId(), NotificationType.STUDY_GROUP_INVITE)
                .ifPresent(n -> { n.setResponse("REJECTED"); notificationRepository.save(n); });
    }

    @Transactional
    public List<PendingInviteDTO> getPendingInvites(Long userId) {
        return studyGroupInviteRepository
                .findAllByInviteeIdAndStatus(userId, StudyGroupInviteStatus.PENDING)
                .stream()
                .map(invite -> PendingInviteDTO.builder()
                        .inviteId(invite.getId())
                        .groupId(invite.getInviteeStudyGroup().getId())
                        .groupName(invite.getInviteeStudyGroup().getName())
                        .inviterUsername(invite.getInviter().getUsername())
                        .createdAt(invite.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
}