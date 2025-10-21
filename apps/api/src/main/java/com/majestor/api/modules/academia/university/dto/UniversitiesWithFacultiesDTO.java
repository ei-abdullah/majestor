package com.majestor.api.modules.academia.university.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UniversitiesWithFacultiesDTO {
    private Long id;
    private String name;
    private List<FacultyDTO> faculties;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FacultyDTO {
        private Long id;
        private String name;
    }
}
