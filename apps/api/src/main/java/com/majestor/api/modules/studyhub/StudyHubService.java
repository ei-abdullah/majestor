package com.majestor.api.modules.studyhub;

import com.majestor.api.modules.studyhub.dto.FeedResponseDTO;
import com.majestor.api.modules.studyhub.studygroup.StudyGroup;
import com.majestor.api.modules.studyhub.studygroup.StudyGroupRepository;
import com.majestor.api.modules.studyhub.studygroup.studygroupmember.StudyGroupMemberRepository;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Slf4j
@Service
@Validated
@RequiredArgsConstructor
public class StudyHubService {

    private final UserRepository userRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final StudyGroupMemberRepository studyGroupMemberRepository;
    private final StudyHubMapper studyHubMapper;

    public FeedResponseDTO getStudyHubFeed(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Return joined groups, official groups & trending groups

        Long facultyId = user.getFaculty().getId();
        Long universityId = user.getUniversity().getId();

        List<StudyGroup> joinedGroups = studyGroupMemberRepository.findActiveGroupsByUserId(user.getId());
        List<StudyGroup> officialGroups = studyGroupRepository.findOfficialGroupByFaculty(facultyId);
        List<StudyGroup> trendingGroups = studyGroupRepository.findPeerTrendingGroups(facultyId);
        List<StudyGroup> universityGroups = studyGroupRepository.findUniversityLevelGroups(universityId);


        return studyHubMapper.toFeedResponseDTO(joinedGroups, officialGroups, trendingGroups, universityGroups);
    }
}
