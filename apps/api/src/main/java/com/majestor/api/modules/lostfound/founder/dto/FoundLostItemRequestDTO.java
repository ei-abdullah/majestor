package com.majestor.api.modules.lostfound.founder.dto;

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
public class FoundLostItemRequestDTO {
    private String name;
    private String phone;
    private String foundLocationDescription;
    private LastLocation location;
    private MultipartFile[] foundItemImages;
}
