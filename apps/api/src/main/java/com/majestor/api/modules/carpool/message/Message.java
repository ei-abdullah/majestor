package com.majestor.api.modules.carpool.message;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "carpool_messages",
        indexes = {
                @Index(name = "idx_carpool_messages_participants", columnList = "sender_name, receiver_name, created_at"),
                @Index(name = "idx_carpool_messages_booking_id", columnList = "booking_id")
        }
)
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "sender_name", nullable = false)
    private String senderName;

    @Column(name = "sender_username")
    private String senderUsername;

    @Column(name = "receiver_name", nullable = false)
    private String receiverName;

    @Column(name = "booking_id")
    private Long bookingId;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "date")
    private String date;

    @JsonAlias("status")
    @Enumerated(EnumType.STRING)
    @Column(name = "message_status")
    private MessageStatus messageStatus;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
