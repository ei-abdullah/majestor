package com.majestor.api.modules.studyhub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class FeedResponseDTO {
    private List<JoinedGroupDTO> joinedGroups;
    private List<OfficialGroupDTO> officialGroups;
    private List<TrendingGroupDTO> trendingGroups;


    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class JoinedGroupDTO {
        private Long id;
        private String name;
        private String hostName;
        private String courseName;
        private Integer memberCount;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OfficialGroupDTO {
        private Long id;
        private String name;
        private String hostName;
        private String courseName;
        private Integer memberCount;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TrendingGroupDTO {
        private Long id;
        private String name;
        private String hostName;
        private String courseName;
        private Integer memberCount;
        private Double popularityScore;
    }
}
