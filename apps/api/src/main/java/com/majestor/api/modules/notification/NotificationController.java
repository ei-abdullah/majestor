package com.majestor.api.modules.notification;

import com.majestor.api.modules.notification.dto.GetNotificationsResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
        List<GetNotificationsResponseDTO> response = notificationService.getNotifications(userId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    @PatchMapping("/mark-read/{userId}")
    public ResponseEntity<Void> markAllRead(@PathVariable Long userId) {
        notificationService.markAllRead(userId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/has-unread/{userId}")
    public ResponseEntity<Map<String, Boolean>> hasUnread(@PathVariable Long userId) {
        notificationService.markAllRead(userId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(Map.of("hasUnread", notificationService.hasUnread(userId)));
    }
}
