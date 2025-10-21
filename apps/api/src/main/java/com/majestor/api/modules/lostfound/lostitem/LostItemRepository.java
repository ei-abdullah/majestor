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
            LEFT JOIN li.owner o
            WHERE li.status = 'LOST'
            ORDER BY li.id DESC
            """)
    Page<LostItem> findAllLostItems(Pageable pageable);


    @Query("""
            SELECT li
            FROM LostItem li
            JOIN FETCH li.owner o
            LEFT JOIN FETCH li.lostItemImages img
            WHERE o.id = :ownerId
            AND li.status = :status
            ORDER BY li.id DESC, img.serialNo ASC
            """)
    List<LostItem> findLostItemsByUserId(
            @Param("ownerId") Long ownerId,
            @Param("status") String status
    );


    @Query("""
            SELECT li
            FROM LostItem li
            LEFT JOIN FETCH li.founders f
            WHERE li.id = :lostItemId
            ORDER BY li.id DESC
            """)
    List<LostItem> findLostItemWithFounders(
            @Param("lostItemId") Long lostItemId
    );
}
