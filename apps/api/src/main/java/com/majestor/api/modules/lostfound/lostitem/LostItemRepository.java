package com.majestor.api.modules.lostfound.lostitem;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LostItemRepository extends JpaRepository<LostItem, Long> {
    @Query("""
            SELECT li
            FROM LostItem li
            JOIN FETCH li.owner o
            WHERE li.status = 'LOST'
            ORDER BY li.id DESC
            """)
    List<LostItem> findAllLostItems();


    @Query("""
            SELECT li
            FROM LostItem li
            JOIN FETCH li.lostItemImages
            WHERE li.owner.id = :ownerId
            AND li.status = :status
            ORDER BY li.id DESC
            """)
    List<LostItem> findLostItemsByUserId(
            @Param("ownerId") Long ownerId,
            @Param("status") Status status
    );
}
