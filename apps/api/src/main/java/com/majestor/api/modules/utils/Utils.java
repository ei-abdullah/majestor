package com.majestor.api.modules.utils;

import com.majestor.api.infra.s3.S3Buckets;
import com.majestor.api.infra.s3.S3Service;
import com.majestor.api.modules.document.Document;
import com.majestor.api.modules.lostfound.founder.Founder;
import com.majestor.api.modules.lostfound.lostitem.LostItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.exception.SdkClientException;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class Utils {
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;

    public String DownloadLostItemImage(LostItem lostItem, String imageUri) {
        if (imageUri == null || imageUri.trim().isEmpty()) {
            return null;
        }

        try {
            String key = GetUploadLostItemKey(lostItem.getOwner().getId(), lostItem.getId(), imageUri);
            return s3Service.createPresignedGetUrl(s3Buckets.getBucket(), key);
        } catch (Exception e) {
            log.warn("Failed to download image {} for lost item {}: {}",
                    imageUri, lostItem.getId(), e.getMessage());
            return null;
        }
    }

    public String DownloadFoundItemImage(Founder founder, String imageUri) {
        if (imageUri == null || imageUri.trim().isEmpty()) {
            return null;
        }

        try {
            String key = GetUploadFoundItemKey(founder.getFounder().getId(), founder.getId(), imageUri);
            return s3Service.createPresignedGetUrl(s3Buckets.getBucket(), key);
        } catch (Exception e) {
            log.warn("Failed to download image {} for founder {}: {}",
                    imageUri, founder.getId(), e.getMessage());
            return null;
        }
    }

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

    public String GetUploadLostItemKey(Long userId, Long lostItemId, String lostItemImageId) {
        return "user/%s/lostItems/%s/%s"
                .formatted(userId, lostItemId, lostItemImageId);
    }

    public String GetUploadFoundItemKey(Long userId, Long foundItemId, String foundItemImageId) {
        return "user/%s/foundItems/%s/%s"
                .formatted(userId, foundItemId, foundItemImageId);
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

    public String RemoveSpace(String input) {
        if (input == null) {
            return null;
        }
        return input.replaceAll("\\s+", "");
    }

    public String ExtractFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "jpg"; // default
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

}
