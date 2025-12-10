package com.majestor.api.modules.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    /*
    @Query("""
            SELECT DISTINCT d
            FROM Document d
            LEFT JOIN FETCH d.likes lk
            LEFT JOIN FETCH d.documentImages di
            LEFT JOIN FETCH d.course c
            WHERE d.uploader.id = :userId
            AND d.uploader.faculty.id = :facultyId
            AND di.serialNumber = 1
            """)
    List<Document> getDocumentsByUserIdAndFacultyId(
            @Param("userId") Long userId,
            @Param("facultyId") Long facultyId
    );
    */

    @Query("""
            SELECT DISTINCT d
            FROM Document d
            LEFT JOIN FETCH d.documentImages di
            LEFT JOIN FETCH d.course s
            WHERE d.uploader.id = :userId
            AND d.uploader.faculty.id = :facultyId
            AND di.serialNumber = 1
            """)
    List<Document> getDocumentsByUserIdAndFacultyId(
            @Param("userId") Long userId,
            @Param("facultyId") Long facultyId
    );

    @Query("""
                SELECT d.id, COUNT(l)
                FROM Document d
                LEFT JOIN d.likes l
                WHERE d.uploader.id = :userId
                AND d.uploader.faculty.id = :facultyId
                GROUP BY d.id
            """)
    List<Object[]> getLikeCountByUserIdAndFacultyId(
            @Param("userId") Long userId,
            @Param("facultyId") Long facultyId
    );
}
