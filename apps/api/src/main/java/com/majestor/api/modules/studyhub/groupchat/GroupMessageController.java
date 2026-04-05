package com.majestor.api.modules.studyhub.groupchat;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class GroupMessageController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/study-group/{groupId}/send")
    public void sendGroupMessage(
            @DestinationVariable Long groupId,
            @Payload GroupMessage groupMessage
    ) {
        String destination = "/topic/group/" + groupId;
        simpMessagingTemplate.convertAndSend(destination, groupMessage);

        log.info("Group message sent to group {}: {}", groupId, groupMessage);
    }
}
