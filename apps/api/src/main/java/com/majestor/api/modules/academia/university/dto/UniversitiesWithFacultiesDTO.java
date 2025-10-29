package com.majestor.api.modules.academia.university.dto;

import jakarta.validation.constraints.*;
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
    @NotNull(message = "University ID is required")
    @Positive(message = "University ID must be a positive number")
    private Long id;

    @NotBlank(message = "University name is required")
    @Size(max = 100, message = "University name must be less than 100 characters")
    private String name;

    @NotEmpty(message = "Faculties are required")
    private List<FacultyDTO> faculties;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FacultyDTO {
        @NotNull(message = "Faculty ID is required")
        @Positive(message = "Faculty ID must be a positive number")
        private Long id;

        @NotBlank(message = "Faculty name is required")
        @Size(max = 100, message = "Faculty name must be less than 100 characters")
        private String name;
    }
}
