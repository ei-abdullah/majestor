package com.majestor.api.modules.studyhub.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    @Query("""
            SELECT DISTINCT d
            FROM Document d
            LEFT JOIN FETCH d.documentImages di
            LEFT JOIN FETCH d.course c
            WHERE d.uploader.faculty.id = :facultyId
            AND di.serialNumber = 1
            ORDER BY d.id DESC
            """)
    List<Document> getDocumentsByFacultyId(
            @Param("facultyId") Long facultyId
    );

    @Query("""
                SELECT d.id, COUNT(l)
                FROM Document d
                LEFT JOIN d.likes l
                WHERE d.uploader.faculty.id = :facultyId
                GROUP BY d.id
            """)
    List<Object[]> getLikeCountByFacultyId(
            @Param("facultyId") Long facultyId
    );
}
