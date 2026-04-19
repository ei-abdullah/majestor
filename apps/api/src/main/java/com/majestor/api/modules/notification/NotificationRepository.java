package com.majestor.api.modules.notification;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("""
        SELECT n
        FROM Notification n
        LEFT JOIN FETCH n.sender
        WHERE n.recipient.id = :recipientId
        ORDER BY n.createdAt DESC
    """)
    List<Notification> findByRecipientId(Long recipientId);

    boolean existsByRecipientIdAndIsReadFalse(Long recipientId);

    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.recipient.id = :recipientId")
    void markAllReadByRecipientId(Long recipientId);

    Optional<Notification> findByRelatedIdAndNotificationType(Long relatedId, NotificationType notificationType);
}