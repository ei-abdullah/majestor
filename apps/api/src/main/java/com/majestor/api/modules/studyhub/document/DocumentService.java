package com.majestor.api.modules.studyhub.document;

import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.infra.s3.S3Buckets;
import com.majestor.api.infra.s3.S3Service;
import com.majestor.api.modules.academia.course.Course;
import com.majestor.api.modules.academia.course.CourseRepository;
import com.majestor.api.modules.academia.faculty.Faculty;
import com.majestor.api.modules.academia.faculty.FacultyRepository;
import com.majestor.api.modules.studyhub.document.documentimage.DocumentImage;
import com.majestor.api.modules.studyhub.document.documentimage.DocumentImageRepository;
import com.majestor.api.modules.studyhub.document.dto.DocumentImageAndExtensionDTO;
import com.majestor.api.modules.studyhub.document.dto.DocumentUploadRequestDTO;
import com.majestor.api.modules.studyhub.document.dto.VaultDocumentDTO;
import com.majestor.api.modules.studyhub.document.dto.FiltersDTO;
import com.majestor.api.modules.studyhub.document.like.LikeRepository;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import com.majestor.api.modules.utils.Utils;
import com.majestor.api.modules.studyhub.studygroup.StudyGroup;
import com.majestor.api.modules.studyhub.studygroup.StudyGroupRepository;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkClientException;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;


@Slf4j
@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final DocumentImageRepository documentImageRepository;
    private final LikeRepository likeRepository;
    private final S3Service s3Service;
    private final Utils utils;
    private final S3Buckets s3Buckets;
    private final DocumentMapper documentMapper;
    private final FacultyRepository facultyRepository;
    private final StudyGroupRepository studyGroupRepository;

    @Transactional
    public void uploadDocument(
            DocumentUploadRequestDTO documentUploadRequestDTO,
            Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with user id " + userId + " not found!"));

        // Check Storage Quota
        long upcomingTotalSize = Arrays.stream(documentUploadRequestDTO.getDocumentImages())
                .mapToLong(MultipartFile::getSize)
                .sum();

        if (documentUploadRequestDTO.getDestination() == DocumentDestination.PERSONAL_VAULT) {
            if (user.getStorageUsed() + upcomingTotalSize > user.getStorageLimit()) {
                throw new IllegalArgumentException("Personal Vault limit exceeded! Upgrade to Elite for more space.");
            }
        }

        Course course = null;
        if (documentUploadRequestDTO.getCourseId() != null) {
            course = courseRepository.findById(documentUploadRequestDTO.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course with id " + documentUploadRequestDTO.getCourseId() + " not found!"));
        }

        StudyGroup studyGroup = null;
        if (documentUploadRequestDTO.getStudyGroupId() != null) {
            studyGroup = studyGroupRepository.findById(documentUploadRequestDTO.getStudyGroupId())
                    .orElseThrow(() -> new ResourceNotFoundException("Study group with id " + documentUploadRequestDTO.getStudyGroupId() + " not found!"));
        }

        Document document = documentMapper.toDocument(documentUploadRequestDTO, user, course, studyGroup);
        document = documentRepository.save(document);

        List<DocumentImageAndExtensionDTO> documentImages = new ArrayList<>();
        List<String> successfulUploadedKeys = new ArrayList<>();

        long totalFileSize = 0L;
        long serialNumber = 1L;
        String documentImageId;

        for (MultipartFile image : documentUploadRequestDTO.getDocumentImages()) {
            if (image.isEmpty()) continue;

            String fileExt = utils.ExtractFileExtension(image.getOriginalFilename());
            totalFileSize += image.getSize();

            try {
                documentImageId = UUID.randomUUID().toString();
                byte[] documentImageBytes = image.getBytes();
                String key = utils.GetUploadDocumentKey(user.getId(), document.getId(), documentImageId);

                s3Service.uploadFile(
                        documentImageBytes,
                        key,
                        s3Buckets.getBucket()
                );
                successfulUploadedKeys.add(key);

                DocumentImage documentImage = DocumentImage
                        .builder()
                        .imageUri(documentImageId)
                        .serialNumber(serialNumber++)
                        .document(document)
                        .build();

                documentImages.add(
                        DocumentImageAndExtensionDTO
                                .builder()
                                .documentImage(documentImage)
                                .fileExtension(fileExt)
                                .build()
                );
            } catch (IOException e) {
                utils.CleanupUploadedImages(successfulUploadedKeys, s3Buckets.getBucket());
                throw new IllegalArgumentException("Invalid image file: " + e.getMessage(), e);
            } catch (SdkClientException e) {
                utils.CleanupUploadedImages(successfulUploadedKeys, s3Buckets.getBucket());
                throw new RuntimeException("Failed to upload image to S3: " + e.getMessage(), e);
            }
        }

        try {
            List<DocumentImage> imagesToSave = documentImages
                    .stream()
                    .map(dto -> {
                        DocumentImage image = dto.getDocumentImage();
                        image.setFileExtension(dto.getFileExtension());
                        return image;
                    })
                    .toList();
            List<DocumentImage> savedDocumentImages = documentImageRepository.saveAll(imagesToSave);
            document.setDocumentImages(savedDocumentImages);
            document.setTotalFileSize(totalFileSize);
            documentRepository.save(document);

            // Only update user's cumulative storage if it's a private upload
            if (document.getDestination() == DocumentDestination.PERSONAL_VAULT) {
                user.setStorageUsed(user.getStorageUsed() + totalFileSize);
                userRepository.save(user);
            }

        } catch (Exception e) {
            utils.CleanupUploadedImages(successfulUploadedKeys, s3Buckets.getBucket());
            log.error("Failed to save document images metadata: {}", e.getMessage());
            throw new RuntimeException("Failed to save image metadata: " + e.getMessage(), e);
        }
    }

    public List<VaultDocumentDTO> getVaultDocuments(
            Long userId,
            DocumentDestination destination,
            FiltersDTO filters
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with user id " + userId + " not found!"));

        Faculty faculty = facultyRepository.findById(user.getFaculty().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found for user id " + userId + "!"));

        List<Document> documents;

        if (destination == DocumentDestination.PERSONAL_VAULT) {
            documents = documentRepository.findByUserAndDestination(
                    user.getId(),
                    DocumentDestination.PERSONAL_VAULT
            );
        } else {
            documents = documentRepository.findByFacultyAndDestination(
                    faculty.getId(),
                    DocumentDestination.PUBLIC_VAULT
            );
        }

        if (documents.isEmpty()) {
            return List.of();
        }

        Stream<Document> documentsStream = documents
                .stream();

        // Apply filters
        if (filters.getSearchQuery() != null) {
            String query = filters.getSearchQuery().trim().toLowerCase();
            documentsStream = documentsStream
                    .filter(doc ->
                            doc.getTitle().toLowerCase().contains(query) ||
                                    (doc.getCourse() != null && doc.getCourse().getName().toLowerCase().contains(query))
                    );
        }

        if (filters.getYear() != null && filters.getYear() > 0) {
            documentsStream = documentsStream
                    .filter(doc -> doc.getUploadedYear().equals(filters.getYear()));
        }

        if (filters.getDocType() != null && !filters.getDocType().isEmpty()) {
            DocType docTypeEnum = DocType.valueOf(filters.getDocType());
            documentsStream = documentsStream
                    .filter(doc -> doc.getDocumentType().equals(docTypeEnum));
        }

        if (filters.getSortByLikes() != null && filters.getSortByLikes()) {
            documentsStream = documentsStream
                    .sorted((doc1, doc2) -> doc2.getLikes().size() - doc1.getLikes().size());
        }
        documents = documentsStream.toList();

        List<Long> docIds = documents
                .stream()
                .map(Document::getId)
                .toList();

        Map<Long, Long> likeCountMap;

        if (!docIds.isEmpty()) {
            List<Object[]> likesCounts = documentRepository.getLikeCountsForIds(docIds);

            likeCountMap = likesCounts
                    .stream()
                    .collect(Collectors.toMap(
                            row -> (Long) row[0],
                            row -> (Long) row[1]
                    ));
        } else {
            likeCountMap = Map.of();
        }

        return documents
                .stream()
                .map(doc -> {
                    String documentImageUri = doc.getDocumentImages().isEmpty() ?
                            null : doc.getDocumentImages().getFirst().getImageUri();

                    String presignedUri = documentImageUri != null ?
                            utils.DownloadDocumentImage(doc, documentImageUri) : null;

                    Long likesCount = likeCountMap.getOrDefault(doc.getId(), 0L);

                    return documentMapper.toGetAllDocumentsDTO(doc, presignedUri, likesCount);
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public void likeDocument(
            Long userId,
            Long documentId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with user id " + userId + " not found!"));

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document with document id " + documentId + " not found!"));

        if (likeRepository.existsByLikedByAndLikedDocument(user, document)) {
            likeRepository.deleteLike(user.getId(), document.getId());
        } else {
            likeRepository.createNewLike(user, document);
        }
    }

    public void downloadDocument(
            Long userId,
            Long documentId,
            HttpServletResponse response
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id " + userId + " not found!"));

        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document with document id " + documentId + " not found!"));

        validateAccess(document, user);

        String title = document.getTitle();
        String type = String.valueOf(document.getDocumentType());

        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment; filename=\"majestor-" + title + "-" + type.toLowerCase() + "-images.zip\"");

        try (ZipOutputStream zipOut = new ZipOutputStream(response.getOutputStream())) {
            List<DocumentImage> documentImages = document.getDocumentImages();

            for (DocumentImage image : documentImages) {
                String documentImageUri = image.getImageUri();
                String s3Key = utils.GetUploadDocumentKey(
                        document.getUploader().getId(),
                        document.getId(),
                        documentImageUri
                );

                String fileName = String.format("image_%s(%d).%s",
                        document.getTitle(),
                        image.getSerialNumber(),
                        image.getFileExtension()
                );

                try (InputStream s3Stream = s3Service.downloadFileAsStream(s3Key, s3Buckets.getBucket())) {
                    ZipEntry entry = new ZipEntry(fileName);
                    zipOut.putNextEntry(entry);
                    s3Stream.transferTo(zipOut);
                    zipOut.closeEntry();
                } catch (IOException e) {
                    throw new RuntimeException("Failed to download document image: " + e.getMessage(), e);
                }
            }
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to download document images: " + e.getMessage(), e);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create zip file: " + e.getMessage(), e);
        }
    }

    private void validateAccess(Document doc, User user) {
        // If doc is premium and user isn't elite/faculty, block download/view
        if (doc.getIsPremiumOnly() && !user.isElite() && !user.getIsFaculty()) {
            throw new IllegalArgumentException("This document is locked for Elite members. Upgrade to unlock!");
        }
    }

}
