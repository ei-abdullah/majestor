package com.majestor.api.modules.academia.university;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UniversityRepository extends JpaRepository<University, Long> {

    @Query("""
            SELECT DISTINCT u
            FROM University u
            LEFT JOIN FETCH u.faculties
            """)
    List<University> findAllWithFaculties();
}
