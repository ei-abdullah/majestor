package com.majestor.api.modules.studyhub.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {

    @Query("""
            SELECT d.id, COUNT(l)
            FROM Document d
            LEFT JOIN d.likes l
            WHERE d.id IN :ids
            GROUP BY d.id
            """)
    List<Object[]> getLikeCountsForIds(@Param("ids") List<Long> ids);

    @Query("""
            SELECT DISTINCT d
            FROM Document d
            LEFT JOIN FETCH d.documentImages di
            LEFT JOIN FETCH d.course c
            WHERE d.documentStudyGroup.id = :groupId
            AND di.serialNumber = 1
            ORDER BY d.createdAt DESC
            """)
    List<Document> getDocumentsByGroupId(@Param("groupId") Long groupId);

    @Query("""
            SELECT DISTINCT d
            FROM Document d
            LEFT JOIN FETCH d.documentImages di
            LEFT JOIN FETCH d.course c
            WHERE d.uploader.faculty.id = :facultyId
            AND d.destination = :destination
            AND di.serialNumber = 1
            ORDER BY d.createdAt DESC
            """)
    List<Document> findByFacultyAndDestination(
            @Param("facultyId") Long facultyId,
            @Param("destination") DocumentDestination destination
    );

    @Query("""
            SELECT DISTINCT d
            FROM Document d
            LEFT JOIN FETCH d.documentImages di
            LEFT JOIN FETCH d.course c
            WHERE d.uploader.id = :userId
            AND d.destination = :destination
            AND di.serialNumber = 1
            ORDER BY d.createdAt DESC
            """)
    List<Document> findByUserAndDestination(
            @Param("userId") Long userId,
            @Param("destination") DocumentDestination destination
    );
}
