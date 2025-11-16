package com.majestor.api.modules.lostfound.founder.dto;

import com.majestor.api.modules.lostfound.shared.LastLocation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
    @NotBlank(message = "Found location is required")
    private String foundLocationDescription;

    @Valid
    private LastLocation foundLocation;

    @NotNull(message = "Found item images are required")
    private MultipartFile[] foundItemImages;
}
