package com.majestor.api.modules.studyhub.document;

import com.majestor.api.modules.academia.course.Course;
import com.majestor.api.modules.studyhub.document.dto.DocumentUploadRequestDTO;
import com.majestor.api.modules.studyhub.document.dto.VaultDocumentDTO;
import com.majestor.api.modules.studyhub.studygroup.dto.GetGroupDetailsResponseDTO;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.studyhub.studygroup.StudyGroup;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class DocumentMapper {

    public Document toDocument(
            DocumentUploadRequestDTO documentUploadRequestDTO,
            User user,
            Course course,
            StudyGroup studyGroup
    ) {
        return Document
                .builder()
                .title(documentUploadRequestDTO.getTitle())
                .uploadedYear(documentUploadRequestDTO.getUploadedYear())
                .documentType(documentUploadRequestDTO.getDocumentType())
                .semesterType(documentUploadRequestDTO.getSemesterType())
                .uploader(user)
                .course(course)
                .documentStudyGroup(studyGroup)
                .destination(documentUploadRequestDTO.getDestination())
                .isPremiumOnly(documentUploadRequestDTO.getIsPremiumOnly())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    public VaultDocumentDTO toGetAllDocumentsDTO(Document document, String documentImageUri, long likesCount) {
        return VaultDocumentDTO
                .builder()
                .id(document.getId())
                .title(document.getTitle())
                .year(document.getUploadedYear())
                .documentType(String.valueOf(document.getDocumentType()))
                .semesterType(String.valueOf(document.getSemesterType()))
                .course(document.getCourse() != null ? document.getCourse().getName() : "General")
                .imageUri(documentImageUri)
                .likesCount(likesCount)
                .build();
    }

    public GetGroupDetailsResponseDTO.DocumentDTO toDocumentDTO(Document document, String documentImageUri, long likesCount) {
        return GetGroupDetailsResponseDTO.DocumentDTO
                .builder()
                .id(document.getId())
                .title(document.getTitle())
                .year(document.getUploadedYear())
                .documentType(String.valueOf(document.getDocumentType()))
                .semesterType(String.valueOf(document.getSemesterType()))
                .course(document.getCourse() != null ? document.getCourse().getName() : "General")
                .imageUri(documentImageUri)
                .likesCount(likesCount)
                .build();
    }
}
