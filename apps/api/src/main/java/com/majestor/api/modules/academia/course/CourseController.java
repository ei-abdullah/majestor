package com.majestor.api.modules.academia.course;

import com.majestor.api.modules.academia.course.dto.CoursesByUserDTO;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/course")
@RequiredArgsConstructor
public class CourseController {
    private final CourseService courseService;

    @GetMapping("/getCoursesByUser/{userId}")
    public ResponseEntity<CoursesByUserDTO> getCoursesByUserId(
            @PathVariable("userId") @NotNull @Positive Long userId
    ) {
        CoursesByUserDTO response = courseService.getCoursesByUser(userId);

        return ResponseEntity
                .ok()
                .body(response);
    }
}
