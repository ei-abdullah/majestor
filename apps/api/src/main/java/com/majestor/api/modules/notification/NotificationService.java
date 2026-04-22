package com.majestor.api.modules.notification;

import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.modules.notification.dto.GetNotificationsResponseDTO;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import com.majestor.api.modules.utils.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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

        String pushToken = userRepository.findById(recipient.getId())
                .map(User::getExpoPushToken)
                .orElse(null);

        log.info("sendNotification: recipientId={}, pushToken={}", recipient.getId(), pushToken);

        if (pushToken != null && !pushToken.isEmpty()) {
            sendExpoPush(pushToken, title, message, type, relatedId);
        } else {
            log.warn("No push token for recipientId={}, skipping Expo push", recipient.getId());
        }
    }

    private void sendExpoPush(String token, String title, String body, NotificationType type, Long relatedId) {
        String expoUrl = "https://exp.host/--/api/v2/push/send";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json");

        Map<String, Object> payload = new HashMap<>();
        payload.put("to", token);
        payload.put("title", title);
        payload.put("body", body);
        payload.put("sound", "default");
        payload.put("channelId", "default");
        Map<String, Object> data = new HashMap<>();
        data.put("type", type.name());
        if (relatedId != null) data.put("id", relatedId);
        payload.put("data", data);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(expoUrl, request, String.class);
            log.info("Expo push sent to token={} | status={} | response={}", token, response.getStatusCode(), response.getBody());
        } catch (Exception e) {
            log.error("Failed to send Expo push notification to token={}: {}", token, e.getMessage());
        }
    }

    @Transactional
    public void markAllRead(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User not found with id: " + userId)
        );

        notificationRepository.markAllReadByRecipientId(user.getId());
    }

    public boolean hasUnread(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new ResourceNotFoundException("User not found with id: " + userId)
        );

        return notificationRepository.existsByRecipientIdAndIsReadFalse(user.getId());
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
                    String senderAvatar = null;
                    Long senderId = null;
                    String senderName = null;

                    if (sender != null) {
                        senderAvatar = avatarCache.computeIfAbsent(sender.getId(), id -> utils.DownloadUserAvatar(sender));
                        senderId = sender.getId();
                        senderName = sender.getUsername();
                    }

                    return GetNotificationsResponseDTO
                            .builder()
                            .id(notification.getId())
                            .title(notification.getTitle())
                            .message(notification.getMessage())
                            .relatedId(notification.getRelatedId())
                            .relatedType(notification.getNotificationType().name())
                            .senderId(senderId)
                            .senderName(senderName)
                            .senderAvatar(senderAvatar)
                            .notificationType(notification.getNotificationType().name())
                            .read(notification.isRead())
                            .response(notification.getResponse())
                            .createdAt(notification.getCreatedAt())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
