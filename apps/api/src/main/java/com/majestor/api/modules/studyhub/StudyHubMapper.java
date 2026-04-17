package com.majestor.api.modules.studyhub;

import com.majestor.api.modules.studyhub.dto.FeedResponseDTO;
import com.majestor.api.modules.studyhub.studygroup.StudyGroup;
import com.majestor.api.modules.studyhub.studygroup.StudyGroupMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class StudyHubMapper {

    private final StudyGroupMapper studyGroupMapper;

    public FeedResponseDTO toFeedResponseDTO(
            List<StudyGroup> joinedGroups,
            List<StudyGroup> officialGroups,
            List<StudyGroup> trendingGroups,
            List<StudyGroup> universityGroups

    ) {
        return FeedResponseDTO.builder()
                .joinedGroups(joinedGroups.stream().map(studyGroupMapper::toJoinedGroupDTO).toList())
                .officialGroups(officialGroups.stream().map(studyGroupMapper::toOfficialGroupDTO).toList())
                .trendingGroups(trendingGroups.stream().map(studyGroupMapper::toTrendingGroupDTO).toList())
                .universityGroups(universityGroups.stream().map(studyGroupMapper::toUniversityGroupDTO).toList())
                .build();
    }
}
