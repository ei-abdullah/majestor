package com.majestor.api.modules.academia.university;

import com.majestor.api.modules.academia.university.dto.UniversitiesWithFacultiesDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UniversityService {

    private final UniversityRepository universityRepository;
    private final UniversityMapper universityMapper;

    public List<UniversitiesWithFacultiesDTO> getUniversitiesWithFaculties() {

        List<University> universities = universityRepository.findAllWithFaculties();

        return universities.stream()
                .map(universityMapper::toUniversitiesWithFacultiesDTO)
                .collect(Collectors.toList());
    }

}
