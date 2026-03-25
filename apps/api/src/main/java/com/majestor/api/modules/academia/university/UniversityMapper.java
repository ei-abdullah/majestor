package com.majestor.api.modules.academia.university;

import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.academia.university.dto.UniversitiesWithFacultiesDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UniversityMapper {

    private UniversitiesWithFacultiesDTO.FacultyDTO toUniversityFacultiesDTO(Faculty faculty) {
        return UniversitiesWithFacultiesDTO.FacultyDTO
                .builder()
                .id(faculty.getId())
                .name(faculty.getName())
                .build();
    }

    private List<UniversitiesWithFacultiesDTO.FacultyDTO> toUniversityFacultiesListDTO(List<Faculty> faculties) {
        if (faculties == null) {
            return List.of();
        }

        return faculties.stream()
                .map(this::toUniversityFacultiesDTO)
                .collect(Collectors.toList());
    }

    public UniversitiesWithFacultiesDTO toUniversitiesWithFacultiesDTO(University university) {
        return UniversitiesWithFacultiesDTO
                .builder()
                .id(university.getId())
                .name(university.getName())
                .faculties(toUniversityFacultiesListDTO(university.getFaculties()))
                .allowedDomains(university.getAllowedDomains())
                .build();
    }
}
