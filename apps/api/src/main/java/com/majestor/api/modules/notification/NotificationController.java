package com.majestor.api.modules.notification;

import com.majestor.api.modules.notification.dto.GetNotificationsResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GetNotificationsResponseDTO>> getNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getNotifications(userId));
    }

    @PatchMapping("/mark-read/{userId}")
    public ResponseEntity<Void> markAllRead(@PathVariable Long userId) {
        notificationService.markAllRead(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/has-unread/{userId}")
    public ResponseEntity<Map<String, Boolean>> hasUnread(@PathVariable Long userId) {
        return ResponseEntity.ok(Map.of("hasUnread", notificationService.hasUnread(userId)));
    }
}
