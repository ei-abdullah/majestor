package com.majestor.api.modules.studyhub.studygroup.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateStudyGroupDTO {
    @NotBlank(message = "Study group name is required")
    @Size(min = 2, max = 50, message = "Study group name must be between 2 and 50 characters")
    private String name;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    private Boolean isPrivate = false;
}
