package com.majestor.api.modules.carpool.message;

import com.majestor.api.modules.notification.NotificationService;
import com.majestor.api.modules.notification.NotificationType;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserPrincipal;
import com.majestor.api.modules.user.UserRepository;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Slf4j
@Validated
@RestController
@RequestMapping("/api/v1/carpool/messages")
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessagingTemplate simpMessagingTemplate;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @MessageMapping("/message")
    public Message sendMessage(
            @Payload Message message
    ) {
        return message;
    }

    @Transactional
    @MessageMapping("/private-message")
    public Message sendPrivateMessage(
            @Payload Message chatMessage
    ) {
        if (chatMessage.getCreatedAt() == null) {
            chatMessage.setCreatedAt(Instant.now());
        }
        if (chatMessage.getDate() == null || chatMessage.getDate().isBlank()) {
            chatMessage.setDate(chatMessage.getCreatedAt().toString());
        }
        if (chatMessage.getMessageStatus() == null) {
            chatMessage.setMessageStatus(MessageStatus.MESSAGE);
        }

        Optional<User> senderOpt = chatMessage.getSenderName() != null
                ? userRepository.findByEmail(chatMessage.getSenderName().trim().toLowerCase())
                : Optional.empty();
        Optional<User> receiverOpt = chatMessage.getReceiverName() != null
                ? userRepository.findByEmail(chatMessage.getReceiverName().trim().toLowerCase())
                : Optional.empty();

        if (senderOpt.isPresent() && (chatMessage.getSenderUsername() == null || chatMessage.getSenderUsername().isBlank())) {
            chatMessage.setSenderUsername(senderOpt.get().getUsername());
        }

        Message savedMessage = messageRepository.save(chatMessage);

        simpMessagingTemplate.convertAndSend(
                "/private/" + chatMessage.getReceiverName(),
                savedMessage
        );
        log.info("Persisted and sent private carpool message id={} to {}", savedMessage.getId(), chatMessage.getReceiverName());

        if (receiverOpt.isPresent() && senderOpt.isPresent()) {
            User sender = senderOpt.get();
            User receiver = receiverOpt.get();
            notificationService.sendNotification(
                    receiver,
                    sender,
                    NotificationType.CARPOOL_MESSAGE,
                    "New Message from " + sender.getUsername(),
                    savedMessage.getMessage(),
                    savedMessage.getBookingId()
            );
        }

        return savedMessage;
    }

    @GetMapping("/history")
    public ResponseEntity<List<Message>> getConversationHistory(
            @RequestParam("peerEmail") @NotBlank String peerEmail,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<Message> history = messageRepository.findConversationHistory(
                principal.getUsername(),
                peerEmail.trim()
        );
        return ResponseEntity.ok(history);
    }
}
