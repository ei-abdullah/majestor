package com.majestor.api.modules.utils;

import com.majestor.api.infra.s3.S3Buckets;
import com.majestor.api.infra.s3.S3Service;
import com.majestor.api.modules.studyhub.document.Document;
import com.majestor.api.modules.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.exception.SdkClientException;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class Utils {
    @Value("${spring.profiles.active}")
    private String activeProfile;

    private final S3Service s3Service;
    private final S3Buckets s3Buckets;

    public String DownloadDocumentImage(Document document, String imageUri) {
        if (imageUri == null || imageUri.trim().isEmpty()) {
            return null;
        }

        try {
            String key = GetUploadDocumentKey(document.getUploader().getId(), document.getId(), imageUri);
            return s3Service.createPresignedGetUrl(s3Buckets.getBucket(), key);
        } catch (Exception e) {
            log.warn("Failed to download image {} for document {}: {}",
                    imageUri, document.getId(), e.getMessage());
            return null;
        }
    }

    public String DownloadUserAvatar(User user) {
        if (user.getAvatar() != null && !user.getAvatar().trim().isEmpty()) {
            try {
                String key = GetUploadUserAvatarKey(user.getId(), user.getAvatar());
                return s3Service.createPresignedGetUrl(s3Buckets.getBucket(), key);
            } catch (SdkClientException e) {
                log.warn("Failed to download avatar from S3: {}", e.getMessage(), e);
                return "";
            } catch (Exception e) {
                log.warn("Failed to read avatar from S3: {}", e.getMessage(), e);
                return "";
            }
        } else {
            return "";
        }
    }

    public String GetUploadDocumentKey(Long userId, Long documentId, String documentImageId) {
        return "user/%s/documents/%s/%s"
                .formatted(userId, documentId, documentImageId);
    }

    public String GetUploadUserAvatarKey(Long userId, String avatarId) {
        return "user/%s/avatar/%s"
                .formatted(userId, avatarId);
    }

    public void CleanupUploadedImages(List<String> uploadedKeys, String bucketName) {
        uploadedKeys.forEach(key -> {
            try {
                s3Service.deleteFile(key, bucketName);
            } catch (SdkClientException e) {
                log.warn("Failed to cleanup uploaded image with key: {}. Manual cleanup may be required.", key, e);
            }
        });
    }

    public String ExtractFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "jpg"; // default
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    public Long FreeStorageLimit() {
        return 100L * 1024 * 1024; // 100 MB
    }

    public Long FacultyStorageLimit() {
        return 500L * 1024 * 1024; // 500 MB
    }

    public Long EliteStorageLimit() {
        return 5L * 1024 * 1024 * 1024; // 5 GB
    }
}
