package com.majestor.api.modules.lostfound.founder;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FounderRepository extends JpaRepository<Founder, Long> {

    @Query("""
            SELECT f
            FROM Founder f
            WHERE f.foundLostItem.id = :lostItemId
            """)
    List<Founder> findFoundersByLostItemId(@Param("lostItemId") Long lostItemId);

}
