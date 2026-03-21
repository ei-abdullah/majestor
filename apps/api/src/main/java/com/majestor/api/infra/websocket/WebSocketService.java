package com.majestor.api.infra.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final SimpMessagingTemplate simpMessagingTemplate;

    public Object sendMessage(String topic, Object payload) {
        simpMessagingTemplate.convertAndSend(topic, payload);
        return payload;
    }

}
