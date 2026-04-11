package com.majestor.api.modules.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("""
        SELECT n
        FROM Notification n
        JOIN FETCH n.sender
        WHERE n.recipient.id = :recipientId
        ORDER BY n.createdAt DESC
    """)
    List<Notification> findByRecipientId(Long recipientId);
}
