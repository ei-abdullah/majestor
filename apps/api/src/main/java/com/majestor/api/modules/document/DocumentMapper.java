package com.majestor.api.modules.document;

import com.majestor.api.modules.academia.course.Course;
import com.majestor.api.modules.document.dto.DocumentUploadRequestDTO;
import com.majestor.api.modules.document.dto.GetAllDocumentsDTO;
import com.majestor.api.modules.user.User;
import org.springframework.stereotype.Component;

@Component
public class DocumentMapper {

    public Document toDocument(
            DocumentUploadRequestDTO documentUploadRequestDTO,
            User user,
            Course course
    ) {
        return Document
                .builder()
                .title(documentUploadRequestDTO.getTitle())
                .uploadedYear(documentUploadRequestDTO.getUploadedYear())
                .documentType(documentUploadRequestDTO.getDocumentType())
                .semesterType(documentUploadRequestDTO.getSemesterType())
                .uploader(user)
                .course(course)
                .build();
    }

    public GetAllDocumentsDTO toGetAllDocumentsDTO(Document document, String documentImageUri, long likesCount) {
        return GetAllDocumentsDTO
                .builder()
                .id(document.getId())
                .title(document.getTitle())
                .year(document.getUploadedYear())
                .documentType(String.valueOf(document.getDocumentType()))
                .semesterType(String.valueOf(document.getSemesterType()))
                .course(document.getCourse().getName())
                .imageUri(documentImageUri)
                .likesCount(likesCount)
                .build();
    }
}
