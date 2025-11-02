package com.majestor.api.modules.lostfound.lostitem;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    Page<LostItem> findAllLostItems(Pageable pageable);


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


    @Query("""
            SELECT li
            FROM LostItem li
            JOIN FETCH li.founders f
            JOIN FETCH li.lostItemImages lii
            WHERE li.id = :lostItemId
            ORDER BY li.id DESC
            """)
    List<LostItem> findLostItemWithFounders(
            @Param("lostItemId") Long lostItemId
    );
}
