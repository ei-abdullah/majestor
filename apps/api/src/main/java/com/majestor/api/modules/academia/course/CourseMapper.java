package com.majestor.api.modules.academia.course;

import com.majestor.api.modules.academia.course.dto.CoursesByUserDTO;
import com.majestor.api.modules.academia.faculty.Faculty;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CourseMapper {

    private CoursesByUserDTO.CourseDTO toCourseDTO(Course course) {
        return CoursesByUserDTO.CourseDTO
                .builder()
                .id(course.getId())
                .name(course.getName())
                .build();
    }

    private List<CoursesByUserDTO.CourseDTO> toCourseDTOList(List<Course> courses) {
        if (courses == null) {
            return List.of();
        }

        return courses.stream()
                .map(this::toCourseDTO)
                .collect(Collectors.toList());
    }

    public CoursesByUserDTO toCoursesByUserDTO(Faculty faculty) {
        return CoursesByUserDTO
                .builder()
                .facultyName(faculty.getName())
                .courses(toCourseDTOList(faculty.getCourses()))
                .build();
    }
}
