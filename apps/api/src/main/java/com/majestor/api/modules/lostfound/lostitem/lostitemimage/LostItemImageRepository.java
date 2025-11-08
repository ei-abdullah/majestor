package com.majestor.api.modules.lostfound.lostitem.lostitemimage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LostItemImageRepository extends JpaRepository<LostItemImage, Long> {
    @Query("""
            SELECT li.imageUri
            FROM LostItemImage li
            WHERE li.lostItem.id = :lostItemId
            AND li.serialNo = 1
            """)
    String getFirstLostItemImageById(@Param("lostItemId") Long lostItemId);

    @Query("""
            SELECT i
            FROM LostItemImage i
            WHERE i.lostItem.id = :lostItemId
            """)
    List<LostItemImage> findImagesByLostItemId(@Param("lostItemId") Long lostItemId);

    List<LostItemImage> findByLostItemId(Long lostItemId);
}
