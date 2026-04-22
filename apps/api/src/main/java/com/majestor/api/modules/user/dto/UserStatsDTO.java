package com.majestor.api.modules.user.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserStatsDTO {
    private long documentsUploaded;
    private long groupsJoined;
    private long ridesPosted;
    private long ridesCompleted;
    private int[] activityLast7Days;
}