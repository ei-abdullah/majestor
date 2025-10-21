package com.majestor.api.modules.lostfound.lostitem.dto;

import com.majestor.api.modules.lostfound.shared.LastLocation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LostItemAndFoundersResponseDTO {
    private Long id;
    private Long ownerId;
    private String title;
    private String description;
    private String phone;
    private String lastLocationDescription;
    private List<LostItemAndFoundersDTO> itemFounders;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class LostItemAndFoundersDTO {
        private Long id;
        private String name;
        private String phone;
        private String foundLocationDescription;
        private LastLocation lastLocation;
        private LocalDateTime createdAt;
    }
}
