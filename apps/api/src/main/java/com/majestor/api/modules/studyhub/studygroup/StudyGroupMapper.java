package com.majestor.api.modules.studyhub.studygroup;

import com.majestor.api.modules.academia.course.Course;
import com.majestor.api.modules.studyhub.dto.FeedResponseDTO;
import com.majestor.api.modules.studyhub.studygroup.dto.CreateStudyGroupDTO;
import com.majestor.api.modules.studyhub.studygroup.dto.CreateStudyGroupResponseDTO;
import com.majestor.api.modules.studyhub.studygroup.dto.GetGroupDetailsResponseDTO;
import com.majestor.api.modules.studyhub.studygroup.dto.JoinStudyGroupResponseDTO;
import com.majestor.api.modules.user.User;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class StudyGroupMapper {

    private String resolveCourseName(StudyGroup group) {
        if (group.getStudyGroupCourse() == null) return null;
        String name = group.getStudyGroupCourse().getName();
        return (name != null && !name.isEmpty()) ? name : "General";
    }

    public FeedResponseDTO.JoinedGroupDTO toJoinedGroupDTO(StudyGroup group) {
        return FeedResponseDTO.JoinedGroupDTO
                .builder()
                .id(group.getId())
                .name(group.getName())
                .hostName(group.getStudyGroupHost().getUsername())
                .courseName(resolveCourseName(group))
                .memberCount(group.getStudyGroupMembers().size())
                .build();
    }

    public FeedResponseDTO.OfficialGroupDTO toOfficialGroupDTO(StudyGroup group) {
        return FeedResponseDTO.OfficialGroupDTO
                .builder()
                .id(group.getId())
                .name(group.getName())
                .hostName(group.getStudyGroupHost().getUsername())
                .courseName(resolveCourseName(group))
                .memberCount(group.getStudyGroupMembers().size())
                .build();
    }

    public FeedResponseDTO.TrendingGroupDTO toTrendingGroupDTO(StudyGroup group) {
        return FeedResponseDTO.TrendingGroupDTO
                .builder()
                .id(group.getId())
                .name(group.getName())
                .hostName(group.getStudyGroupHost().getUsername())
                .courseName(resolveCourseName(group))
                .memberCount(group.getStudyGroupMembers().size())
                .popularityScore(group.getPopularityScore())
                .build();
    }

    public FeedResponseDTO.UniversityGroupDTO toUniversityGroupDTO(StudyGroup group) {
        return FeedResponseDTO.UniversityGroupDTO
                .builder()
                .id(group.getId())
                .name(group.getName())
                .hostName(group.getStudyGroupHost().getUsername())
                .memberCount(group.getStudyGroupMembers().size())
                .build();
    }

    public StudyGroup toStudyGroup(CreateStudyGroupDTO dto, User host, Course course) {
        return StudyGroup.builder()
                .name(dto.getName())
                .studyGroupHost(host)
                .studyGroupCourse(course)
                .isOfficial(host.getIsFaculty())
                .isPrivate(dto.getIsPrivate())
                .isActive(true)
                .popularityScore(0.0)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    public CreateStudyGroupResponseDTO toCreateStudyGroupResponseDTO(StudyGroup group) {
        return CreateStudyGroupResponseDTO
                .builder()
                .id(group.getId())
                .name(group.getName())
                .hostName(group.getStudyGroupHost().getUsername())
                .isOfficial(group.getIsOfficial())
                .createdAt(group.getCreatedAt())
                .build();
    }

    public JoinStudyGroupResponseDTO toJoinStudyGroupResponseDTO(StudyGroup group) {
        return JoinStudyGroupResponseDTO
                .builder()
                .id(group.getId())
                .build();
    }

    public GetGroupDetailsResponseDTO toGetGroupDetailsResponseDTO(
            StudyGroup studyGroup,
            List<GetGroupDetailsResponseDTO.DocumentDTO> documents,
            boolean isMember,
            boolean isPreview
    ) {
        return GetGroupDetailsResponseDTO
                .builder()
                .id(studyGroup.getId())
                .name(studyGroup.getName())
                .hostName(studyGroup.getStudyGroupHost().getUsername())
                .courseId(studyGroup.getStudyGroupCourse() != null ? studyGroup.getStudyGroupCourse().getId() : null)
                .courseName(resolveCourseName(studyGroup))
                .memberCount(studyGroup.getStudyGroupMembers().size())
                .popularityScore(studyGroup.getPopularityScore())
                .isCurrentUserMember(isMember)
                .isOfficial(studyGroup.getIsOfficial())
                .isPreview(isPreview)
                .documents(documents)
                .build();
    }
}
