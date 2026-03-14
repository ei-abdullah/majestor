package com.majestor.api.modules.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class MessageController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message sendMessage(
            @Payload Message message
    ) {
        return message;
    }

    @MessageMapping("/private-message")
    public Message addUser(
            @Payload Message chatMessage
    ) {
        simpMessagingTemplate.convertAndSendToUser(
                chatMessage.getReceiverName(),
                "/private",
                chatMessage
        );
        return chatMessage;
    }
}
