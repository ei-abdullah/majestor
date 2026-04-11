package com.majestor.api.modules.notification.dto;

import com.majestor.api.modules.notification.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class GetNotificationsResponseDTO {

    private Long id;
    private String title;
    private String message;

    private Long relatedId;
    private String relatedType;

    private Long senderId;
    private String senderName;
    private String senderAvatar;

    private String notificationType;

    private Instant createdAt;
}
