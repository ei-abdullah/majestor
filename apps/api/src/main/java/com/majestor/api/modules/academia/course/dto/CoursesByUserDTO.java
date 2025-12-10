package com.majestor.api.modules.academia.course.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CoursesByUserDTO {
    private String facultyName;
    private List<CourseDTO> courses;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CourseDTO {
        private Long id;
        private String name;
    }
}
