package com.majestor.api.modules.studyhub.studygroup.studygroupinvite;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PendingInviteDTO {
    private Long inviteId;
    private Long groupId;
    private String groupName;
    private String inviterUsername;
    private Instant createdAt;
}