package com.majestor.api.modules.chat;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    public Message sendMessage(
            @Payload Message message
    ) {
        return message;
    }

    @MessageMapping("/private-message")
    public Message sendPrivateMessage(
            @Payload Message chatMessage
    ) {
        simpMessagingTemplate.convertAndSend(
                "/private/" + chatMessage.getReceiverName(),
                chatMessage
        );
        log.info("Message sent to private channel: {}", chatMessage);
        return chatMessage;
    }
}
