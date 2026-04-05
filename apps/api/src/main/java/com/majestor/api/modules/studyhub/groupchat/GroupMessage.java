package com.majestor.api.modules.studyhub.groupchat;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class GroupMessage {
    private String senderName;
    private String senderEmail;
    private String content;
    private Long groupId;
    private Instant createdAt;
}
