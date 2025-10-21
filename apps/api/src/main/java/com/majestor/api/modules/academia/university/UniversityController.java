package com.majestor.api.modules.academia.university;

import com.majestor.api.modules.academia.university.dto.UniversitiesWithFacultiesDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/university")
@RequiredArgsConstructor
public class UniversityController {

    private final UniversityService universityService;

    @GetMapping("/getWithFaculties")
    public ResponseEntity<List<UniversitiesWithFacultiesDTO>> getUniversitiesWithFaculties() {
        List<UniversitiesWithFacultiesDTO> response = universityService.getUniversitiesWithFaculties();

        return ResponseEntity
                .ok()
                .body(response);
    }
}
