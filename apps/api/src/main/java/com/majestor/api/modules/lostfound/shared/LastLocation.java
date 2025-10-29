package com.majestor.api.modules.lostfound.shared;

import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@Embeddable
@NoArgsConstructor
@AllArgsConstructor
public class LastLocation {
    @NotBlank(message = "Latitude is required")
    private String lat;
    @NotBlank(message = "Longitude is required")
    private String lng;
}
