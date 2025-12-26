package com.majestor.api.modules.academia.course;

import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.modules.academia.course.dto.CoursesByUserDTO;
import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.academia.faculty.FacultyRepository;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final UserRepository userRepository;
    private final CourseMapper courseMapper;
    private final CourseRepository courseRepository;

    public CoursesByUserDTO getCoursesByFaculty(
            Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Long facultyId = user.getStudentFaculty().getId();

        Faculty faculty = courseRepository.findFacultyByIdWithCourses(facultyId);

        return courseMapper.toCoursesByUserDTO(faculty);
    }
}
