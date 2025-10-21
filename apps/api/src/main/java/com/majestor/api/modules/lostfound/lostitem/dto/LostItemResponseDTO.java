package com.majestor.api.modules.lostfound.lostitem.dto;

import com.majestor.api.modules.lostfound.lostitem.Status;
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
public class LostItemResponseDTO {
    private Long id;
    private String title;
    private Status status;
    private Long ownerId;
    private List<byte[]> imageUris;
    private LocalDateTime createdAt;
}
