package com.majestor.api.modules.academia.course;

import com.majestor.api.modules.academia.faculty.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findById(Long id);

    @Query("""
            SELECT f
            FROM Faculty f
            JOIN FETCH f.courses
            WHERE f.id = :facultyId
            """)
    Faculty findFacultyByIdWithCourses(@Param("facultyId") Long facultyId);
}
