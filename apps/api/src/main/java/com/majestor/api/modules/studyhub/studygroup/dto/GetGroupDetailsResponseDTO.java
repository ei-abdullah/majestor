package com.majestor.api.modules.studyhub.studygroup.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetGroupDetailsResponseDTO {
    private Long id;
    private String name;
    private String hostName;
    private Long courseId;
    private String courseName;
    private Integer memberCount;
    private Double popularityScore;
    private Boolean isPrivate;

    private Boolean isCurrentUserMember;
    private Boolean isPreview;
    private Boolean isOfficial;

    private List<DocumentDTO> documents;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DocumentDTO {
        private Long id;
        private String title;
        private Long year;
        private String documentType;
        private String semesterType;
        private String course;
        private String imageUri;
        
        @JsonProperty("isPremiumOnly")
        private Boolean isPremiumOnly;
        
        private long likesCount;
    }
}
