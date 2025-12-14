package com.majestor.api.modules.document;

import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.infra.s3.S3Buckets;
import com.majestor.api.infra.s3.S3Service;
import com.majestor.api.modules.academia.course.Course;
import com.majestor.api.modules.academia.course.CourseRepository;
import com.majestor.api.modules.document.documentimage.DocumentImage;
import com.majestor.api.modules.document.documentimage.DocumentImageRepository;
import com.majestor.api.modules.document.dto.DocumentImageAndExtensionDTO;
import com.majestor.api.modules.document.dto.DocumentUploadRequestDTO;
import com.majestor.api.modules.document.dto.GetAllDocumentsDTO;
import com.majestor.api.modules.document.dto.GetAllDocumentsFiltersDTO;
import com.majestor.api.modules.document.like.LikeRepository;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import com.majestor.api.modules.utils.Utils;
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
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
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

    @Transactional
    public void uploadDocument(
            DocumentUploadRequestDTO documentUploadRequestDTO,
            Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with user id " + userId + " not found!"));

        Course course = courseRepository.findById(documentUploadRequestDTO.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course with id " + documentUploadRequestDTO.getCourseId() + " not found!"));

        Document document = documentMapper.toDocument(documentUploadRequestDTO, user, course);
        document = documentRepository.save(document);

        List<DocumentImageAndExtensionDTO> documentImages = new ArrayList<>();
        List<String> successfulUploadedKeys = new ArrayList<>();

        long serialNumber = 1L;
        String documentImageId;

        for (MultipartFile image : documentUploadRequestDTO.getDocumentImages()) {
            if (image.isEmpty()) continue;

            String fileExt = utils.ExtractFileExtension(image.getOriginalFilename());

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
            documentRepository.save(document);
        } catch (Exception e) {
            utils.CleanupUploadedImages(successfulUploadedKeys, s3Buckets.getBucket());
            log.error("Failed to save document images metadata: {}", e.getMessage());
            throw new RuntimeException("Failed to save image metadata: " + e.getMessage(), e);
        }
    }

    public List<GetAllDocumentsDTO> getAllDocuments(
            Long userId,
            GetAllDocumentsFiltersDTO filters
    ) {
        //1. Filter by stream or
        //2. Filter by SQL query

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with user id " + userId + " not found!"));

        List<Document> documents = documentRepository.getDocumentsByUserIdAndFacultyId(
                user.getId(),
                user.getFaculty().getId()
        );

        List<Object[]> likesCounts = documentRepository.getLikeCountByUserIdAndFacultyId(
                user.getId(),
                user.getFaculty().getId()
        );

        Map<Long, Long> likeCountMap = likesCounts
                .stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> (Long) row[1]
                ));

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
            Long documentId,
            HttpServletResponse response
    ) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document with document id " + documentId + " not found!"));

        String title = document.getTitle();
        String type = String.valueOf(document.getDocumentType());
        String course = document.getCourse().getName();

        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment; filename=\"majestor-" + title + "-" + course + "-" + type + "-images.zip\"");

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
}
