package com.majestor.api.modules.studyhub;

import com.majestor.api.modules.studyhub.dto.FeedResponseDTO;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/study-hub")
@RequiredArgsConstructor
public class StudyHubController {

    private final StudyHubService studyHubService;

    @PostMapping("/feed/{userId}")
    public ResponseEntity<FeedResponseDTO> feed(
            @PathVariable @NotNull @Positive Long userId
    ) {
        FeedResponseDTO feedResponseDTO = studyHubService.getStudyHubFeed(userId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(feedResponseDTO);
    }
}
