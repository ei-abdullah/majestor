package com.majestor.api.modules.notification;

import com.majestor.api.modules.notification.dto.GetNotificationsResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GetNotificationsResponseDTO>> getNotifications(
            @PathVariable Long userId
    ) {
        List<GetNotificationsResponseDTO> response = notificationService.getNotifications(userId);

        return ResponseEntity
                .ok()
                .body(response);
    }
}
