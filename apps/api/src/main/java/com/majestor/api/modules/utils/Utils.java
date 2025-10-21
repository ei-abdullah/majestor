package com.majestor.api.modules.utils;

import com.majestor.api.infra.s3.S3Service;
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

    public String GetUploadLostItemKey(Long userId, Long lostItemId, String lostItemImageId) {
        return "user/%s/%s/lostItems/%s"
                .formatted(userId, lostItemId, lostItemImageId);
    }

    public String GetUploadFoundItemKey(Long userId, Long foundItemId, String foundItemImageId) {
        return "user/%s/%s/foundItems/%s"
                .formatted(userId, foundItemId, foundItemImageId);
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
}
