package com.majestor.api.modules.studyhub.studygroup.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateStudyGroupResponseDTO {
    private Long id;
    private String name;
    private String courseName;
    private String hostName;
    private Boolean isOfficial;
    private Instant createdAt;
}
