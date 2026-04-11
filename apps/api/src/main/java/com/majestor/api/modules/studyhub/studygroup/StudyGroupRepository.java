package com.majestor.api.modules.studyhub.studygroup;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {

    @Query("""
            SELECT g
            FROM StudyGroup g
            WHERE g.isOfficial = TRUE
            AND g.studyGroupCourse.facultyCourses.id = :facultyId
            AND g.isPrivate = FALSE
            ORDER BY g.createdAt DESC
            """)
    List<StudyGroup> findOfficialGroupByFaculty(@Param("facultyId") Long facultyId);

    @Query("""
            SELECT g
            FROM StudyGroup g
            WHERE g.studyGroupCourse.facultyCourses.id = :facultyId
            AND g.isOfficial = FALSE
            AND g.isPrivate = FALSE
            ORDER BY g.popularityScore DESC
            """)
    List<StudyGroup> findPeerTrendingGroups(@Param("facultyId") Long facultyId);

    @Query("""
            SELECT COUNT(g)
            FROM StudyGroup g
            WHERE g.studyGroupHost.id = :userId
            AND g.isOfficial = FALSE
            """)
    long countByStudyGroupHosts(@Param("userId") Long userId);
}
