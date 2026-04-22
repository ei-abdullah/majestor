package com.majestor.api.modules.studyhub.studygroup.studygroupinvite;

import com.majestor.api.modules.studyhub.studygroup.studygroupinvite.dto.PendingInviteDTO;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/study-group/invites")
@RequiredArgsConstructor
public class StudyGroupInviteController {

    private final StudyGroupInviteService studyGroupInviteService;

    @PostMapping("/send/{groupId}/{inviterId}/{inviteeId}")
    public ResponseEntity<?> sendInvite(
            @PathVariable @NotNull @Positive Long groupId,
            @PathVariable @NotNull @Positive Long inviterId,
            @PathVariable @NotNull @Positive Long inviteeId
    ) {
        studyGroupInviteService.sendInvite(groupId, inviterId, inviteeId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @PatchMapping("/accept/{inviteId}")
    public ResponseEntity<?> acceptInvite(
            @PathVariable @NotNull @Positive Long inviteId
    ) {
        studyGroupInviteService.acceptInvite(inviteId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @PatchMapping("/reject/{inviteId}")
    public ResponseEntity<?> rejectInvite(
            @PathVariable @NotNull @Positive Long inviteId
    ) {
        studyGroupInviteService.rejectInvite(inviteId);

        return ResponseEntity
                .status(HttpStatus.OK)
                .build();
    }

    @GetMapping("/pending/{userId}")
    public ResponseEntity<List<PendingInviteDTO>> getPendingInvites(
            @PathVariable @NotNull @Positive Long userId
    ) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(studyGroupInviteService.getPendingInvites(userId));
    }
}
