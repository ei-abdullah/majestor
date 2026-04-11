package com.majestor.api.modules.notification;

import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.modules.notification.dto.GetNotificationsResponseDTO;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import com.majestor.api.modules.utils.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final UserRepository userRepository;
    private final Utils utils;

    @Async
    public void sendNotification(User recipient, User sender, NotificationType type, String title, String message, Long relatedId) {
        Notification notification = Notification
                .builder()
                .recipient(recipient)
                .sender(sender)
                .notificationType(type)
                .title(title)
                .message(message)
                .relatedId(relatedId)
                .createdAt(Instant.now())
                .build();

        notificationRepository.save(notification);

        if (recipient.getExpoPushToken() != null && !recipient.getExpoPushToken().isEmpty()) {
            sendExpoPush(recipient.getExpoPushToken(), title, message, type, relatedId);
        }
    }

    private void sendExpoPush(String token, String title, String body, NotificationType type, Long relatedId) {
        String expoUrl = "https://exp.host/--/api/v2/push/send";

        Map<String, Object> payload = Map.of(
                "to", token,
                "title", title,
                "body", body,
                "data", Map.of("type", type.name(), "id", relatedId),
                "sound", "default"
        );

        try {
            restTemplate.postForEntity(expoUrl, payload, String.class);
        } catch (Exception e) {
            log.error("Failed to send Expo push notification: {}", e.getMessage());
        }
    }

    public List<GetNotificationsResponseDTO> getNotifications(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User not found with id: " + userId)
        );

        List<Notification> notificationList = notificationRepository
                .findByRecipientId(user.getId());

        Map<Long, String> avatarCache = new HashMap<>();

        return notificationList
                .stream()
                .map(notification -> {
                    User sender = notification.getSender();
                    String senderAvatar = avatarCache
                            .computeIfAbsent(sender.getId(), id -> utils.DownloadUserAvatar(sender));

                    return GetNotificationsResponseDTO
                            .builder()
                            .id(notification.getId())
                            .title(notification.getTitle())
                            .message(notification.getMessage())
                            .relatedId(notification.getRelatedId())
                            .relatedType(notification.getNotificationType().name())
                            .senderId(notification.getSender().getId())
                            .senderName(notification.getSender().getUsername())
                            .senderAvatar(senderAvatar)
                            .notificationType(notification.getNotificationType().name())
                            .createdAt(notification.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
