package com.majestor.api.modules.studyhub.studygroup;

import com.majestor.api.infra.exception.AccessDeniedException;
import com.majestor.api.infra.exception.DuplicateResourceException;
import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.infra.exception.TierLimitExceededException;
import com.majestor.api.modules.academia.course.Course;
import com.majestor.api.modules.academia.course.CourseRepository;
import com.majestor.api.modules.studyhub.document.Document;
import com.majestor.api.modules.studyhub.document.DocumentMapper;
import com.majestor.api.modules.studyhub.document.DocumentRepository;
import com.majestor.api.modules.studyhub.studygroup.dto.CreateStudyGroupDTO;
import com.majestor.api.modules.studyhub.studygroup.dto.CreateStudyGroupResponseDTO;
import com.majestor.api.modules.studyhub.studygroup.dto.GetGroupDetailsResponseDTO;
import com.majestor.api.modules.studyhub.studygroup.dto.JoinStudyGroupResponseDTO;
import com.majestor.api.modules.studyhub.studygroup.rating.Rating;
import com.majestor.api.modules.studyhub.studygroup.rating.RatingRepository;
import com.majestor.api.modules.studyhub.studygroup.studygroupinvite.StudyGroupInviteRepository;
import com.majestor.api.modules.studyhub.studygroup.studygroupinvite.StudyGroupInviteStatus;
import com.majestor.api.modules.studyhub.studygroup.studygroupmember.StudyGroupMember;
import com.majestor.api.modules.studyhub.studygroup.studygroupmember.StudyGroupMemberRepository;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import com.majestor.api.modules.utils.Utils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Validated
@RequiredArgsConstructor
public class StudyGroupService {

    private final UserRepository userRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final StudyGroupMemberRepository studyGroupMemberRepository;
    private final CourseRepository courseRepository;
    private final StudyGroupMapper studyGroupMapper;
    private final DocumentRepository documentRepository;
    private final Utils utils;
    private final DocumentMapper documentMapper;
    private final RatingRepository ratingRepository;
    private final StudyGroupInviteRepository studyGroupInviteRepository;

    @Transactional
    public CreateStudyGroupResponseDTO createStudyGroup(
            CreateStudyGroupDTO createStudyGroupDTO,
            Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (!user.isElite() && !user.getIsFaculty()) {
            if (studyGroupRepository.countByStudyGroupHosts(userId) >= 1) {
                throw new TierLimitExceededException("Elite tier allows only 1 study group creation. Upgrade to elite to create more.");
            }
        }

        Course course = courseRepository.findById(createStudyGroupDTO.getCourseId())
                .orElse(null);

        StudyGroup groupToSave = studyGroupMapper.toStudyGroup(createStudyGroupDTO, user, course);
        StudyGroup savedGroup = studyGroupRepository.save(groupToSave);

        StudyGroupMember member = StudyGroupMember
                .builder()
                .studyGroup(savedGroup)
                .studyGroupMember(user)
                .joinedAt(Instant.now())
                .build();
        studyGroupMemberRepository.save(member);

        return studyGroupMapper.toCreateStudyGroupResponseDTO(savedGroup);
    }

    @Transactional
    public JoinStudyGroupResponseDTO joinStudyGroup(Long studyGroupId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        StudyGroup studyGroup = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new ResourceNotFoundException("Study group not found with ID: " + studyGroupId));

        if (studyGroupMemberRepository.findActiveMembership(userId, studyGroupId).isPresent()) {
            throw new DuplicateResourceException("User with id " + userId + " is already member of group");
        }

        if (!user.isElite() && !user.getIsFaculty()) {
            if (studyGroupMemberRepository.countActiveMemberships(userId) >= 1) {
                throw new TierLimitExceededException("Elite tier allows only 1 active study group memberships. Upgrade to elite to join more.");
            }
        }

        if (studyGroup.getIsPrivate()) {
            boolean hasInvited = studyGroupInviteRepository.existsByInviteeIdAndInviteeStudyGroupIdAndStatus(userId, studyGroupId, StudyGroupInviteStatus.ACCEPTED);
            if (!hasInvited) {
                throw new AccessDeniedException("This is a private group. You need an invite to join.");
            }
        }

        StudyGroupMember joinedMember = StudyGroupMember
                .builder()
                .studyGroup(studyGroup)
                .studyGroupMember(user)
                .joinedAt(Instant.now())
                .build();
        studyGroupMemberRepository.save(joinedMember);

        return studyGroupMapper.toJoinStudyGroupResponseDTO(studyGroup);
    }

    @Transactional
    public void leaveStudyGroup(Long studyGroupId, Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new ResourceNotFoundException("Study group not found with ID: " + studyGroupId));

        StudyGroupMember membership = studyGroupMemberRepository.findActiveMembership(userId, studyGroupId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " is not an active member of group with id " + studyGroupId));

        membership.setLeftAt(Instant.now());
        studyGroupMemberRepository.save(membership);
    }

    @Transactional
    public void rateStudyGroup(Long studyGroupId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        StudyGroup group = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new ResourceNotFoundException("Study group not found with ID: " + studyGroupId));

        Optional<Rating> existingRating = ratingRepository.findByRatedByAndRatedStudyGroup(user, group);

        if(existingRating.isPresent()) {
            ratingRepository.delete(existingRating.get());
        } else {
            Rating newRating = Rating
                    .builder()
                    .ratedBy(user)
                    .ratedStudyGroup(group)
                    .build();
            ratingRepository.save(newRating);
        }

        long totalLikes = ratingRepository.countByRatedStudyGroup(group);
        long totalMembers = group.getStudyGroupMembers().size();

        double newScore = totalMembers > 0
                ? ((double) totalLikes/totalMembers) * 5.0
                : 0.0;

        group.setPopularityScore(Math.round(newScore * 10.0) / 10.0);
        studyGroupRepository.save(group);
    }

    public GetGroupDetailsResponseDTO getGroupDetails(Long studyGroupId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        StudyGroup group = studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new ResourceNotFoundException("Study group not found with ID: " + studyGroupId));

        boolean isMember = studyGroupMemberRepository.findActiveMembership(user.getId(), group.getId()).isPresent();

        List<Document> groupDocuments = documentRepository.getDocumentsByGroupId(studyGroupId);

        List<Document> visibleDocuments = isMember
                ? groupDocuments
                : groupDocuments
                .stream()
                .limit(3)
                .toList();

        boolean isPreview = !isMember && groupDocuments.size() > 3;

        List<Long> docIds = visibleDocuments
                .stream()
                .map(Document::getId)
                .toList();

        Map<Long, Long> likesCountMap = docIds.isEmpty() ? Map.of() :
                documentRepository.getLikeCountsForIds(docIds)
                        .stream()
                        .collect(Collectors.toMap(row -> (Long) row[0], row -> (Long) row[1]));

        List<GetGroupDetailsResponseDTO.DocumentDTO> documentsDTO = visibleDocuments
                .stream()
                .map(doc -> {
                    String documentImageUri = doc
                            .getDocumentImages()
                            .isEmpty() ?
                            null :
                            doc.getDocumentImages().getFirst().getImageUri();
                    String presignedUri = documentImageUri != null ?
                            utils.DownloadDocumentImage(doc, documentImageUri) : null;

                    long likesCount = likesCountMap.getOrDefault(doc.getId(), 0L);

                    return documentMapper.toDocumentDTO(doc, presignedUri, likesCount);
                })
                .toList();

        return studyGroupMapper.toGetGroupDetailsResponseDTO(group, documentsDTO, isMember, isPreview);
    }
}
