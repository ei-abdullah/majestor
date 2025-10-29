package com.majestor.api.modules.lostfound.lostitem.dto;

import com.majestor.api.modules.lostfound.shared.LastLocation;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Title must be greater than 2 and less than 100 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 255, message = "Description must be less than 255 characters")
    private String description;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @NotBlank(message = "Found location is required")
    @Size(max = 255, message = "Last location description must be less than 255 characters")
    private String lastLocationDescription;

    @Valid
    private LastLocation lastLocation;

    @NotEmpty(message = "Lost item images are required")
    private MultipartFile[] lostItemImages;
}
