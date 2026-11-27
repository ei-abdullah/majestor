package com.majestor.api.modules.carpool.message;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query("""
            SELECT m FROM Message m
            WHERE (LOWER(m.senderName) = LOWER(:userEmail) AND LOWER(m.receiverName) = LOWER(:peerEmail))
               OR (LOWER(m.senderName) = LOWER(:peerEmail) AND LOWER(m.receiverName) = LOWER(:userEmail))
            ORDER BY m.createdAt ASC, m.id ASC
            """)
    List<Message> findConversationHistory(
            @Param("userEmail") String userEmail,
            @Param("peerEmail") String peerEmail
    );
}
