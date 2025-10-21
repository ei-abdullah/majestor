package com.majestor.api.modules.lostfound.lostitem.dto;

import com.majestor.api.modules.lostfound.shared.LastLocation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateLostItemRequestDTO {
    private String title;
    private String description;
    private String phone;
    private String lastLocationDescription;
    private LastLocation lastLocation;

    private MultipartFile[] lostItemImages;
}
