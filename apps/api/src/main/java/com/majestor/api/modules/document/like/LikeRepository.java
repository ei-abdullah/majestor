package com.majestor.api.modules.document.like;

import com.majestor.api.modules.document.Document;
import com.majestor.api.modules.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Boolean existsByLikedByAndLikedDocument(User user, Document document);

    @Modifying
    @Query("""
            INSERT INTO Like (likedBy, likedDocument)
            VALUES (:userId, :documentId)
            """)
    void createNewLike(
            @Param("userId") Long userId,
            @Param("documentId") Long documentId
    );

    @Modifying
    @Query("""
            DELETE FROM Like 
            WHERE likedBy = :userId
            AND likedDocument = :documentId
            """)
    void deleteLike(
            @Param("userId") Long userId,
            @Param("documentId") Long documentId
    );
}
