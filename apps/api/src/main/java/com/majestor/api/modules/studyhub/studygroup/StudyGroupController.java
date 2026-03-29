package com.majestor.api.modules.studyhub.studygroup;

import com.majestor.api.modules.studyhub.studygroup.dto.CreateStudyGroupDTO;
import com.majestor.api.modules.studyhub.studygroup.dto.CreateStudyGroupResponseDTO;
import com.majestor.api.modules.studyhub.studygroup.dto.GetGroupDetailsResponseDTO;
import com.majestor.api.modules.studyhub.studygroup.dto.JoinStudyGroupResponseDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/v1/studygroup")
@RequiredArgsConstructor
public class StudyGroupController {

    private final StudyGroupService studyGroupService;

    @PostMapping("/create-group/{userId}")
    public ResponseEntity<CreateStudyGroupResponseDTO> createStudyGroup(
            @RequestBody @Valid CreateStudyGroupDTO createStudyGroupDTO,
            @PathVariable @Positive Long userId
    ) {
        CreateStudyGroupResponseDTO response = studyGroupService.createStudyGroup(createStudyGroupDTO, userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/join-group/{studyGroupId}/{userId}")
    public ResponseEntity<JoinStudyGroupResponseDTO> joinStudyGroup(
            @PathVariable @Positive Long studyGroupId,
            @PathVariable @Positive Long userId
    ) {
        JoinStudyGroupResponseDTO response = studyGroupService.joinStudyGroup(studyGroupId, userId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PatchMapping("/leave-group/{studyGroupId}/{userId}")
    public ResponseEntity<JoinStudyGroupResponseDTO> leaveStudyGroup(
            @PathVariable @Positive Long studyGroupId,
            @PathVariable @Positive Long userId
    ) {
        studyGroupService.leaveStudyGroup(studyGroupId, userId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/details/{studyGroupId}/{userId}")
    public ResponseEntity<GetGroupDetailsResponseDTO> getGroupDetails(
            @PathVariable @Positive Long studyGroupId,
            @PathVariable @Positive Long userId
    ) {

        GetGroupDetailsResponseDTO response = studyGroupService.getGroupDetails(studyGroupId, userId);

        return ResponseEntity
                .ok()
                .body(response);
    }
}
