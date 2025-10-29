package com.majestor.api.modules.lostfound.founder;

import com.majestor.api.infra.s3.S3Buckets;
import com.majestor.api.infra.s3.S3Service;
import com.majestor.api.modules.lostfound.founder.dto.FoundLostItemRequestDTO;
import com.majestor.api.modules.lostfound.founder.founditemimage.FoundItemImage;
import com.majestor.api.modules.lostfound.founder.founditemimage.FoundItemImageRepository;
import com.majestor.api.modules.lostfound.lostitem.LostItem;
import com.majestor.api.modules.lostfound.lostitem.LostItemRepository;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import com.majestor.api.modules.utils.Utils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkClientException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class FounderService {

    private final FounderRepository founderRepository;
    private final LostItemRepository lostItemRepository;
    private final FounderMapper founderMapper;
    private final UserRepository userRepository;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;
    private final FoundItemImageRepository foundItemImageRepository;
    private final Utils utils;

    @Transactional
    public void foundLostItem(
            Long founderId,
            Long lostItemId,
            FoundLostItemRequestDTO foundLostItemRequestDTO
    ) {
        LostItem lostItem = lostItemRepository.findById(lostItemId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Lost item not found with id: " + lostItemId
                ));

        User user = userRepository.findById(founderId)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Founder not found with id: " + founderId
                ));

        Founder founder = founderMapper.toFounder(foundLostItemRequestDTO, lostItem, user);
        founder = founderRepository.save(founder);

        List<FoundItemImage> foundItemImages = new ArrayList<>();
        List<String> successfulUploadedKeys = new ArrayList<>();

        long serialNumber = 1L;
        String foundItemImageId;

        for (MultipartFile image : foundLostItemRequestDTO.getFoundItemImages()) {
            if (image.isEmpty()) continue;

            try {
                foundItemImageId = UUID.randomUUID().toString();
                byte[] foundItemImageBytes = image.getBytes();
                String key = utils.GetUploadFoundItemKey(user.getId(), founder.getId(), foundItemImageId);

                s3Service.uploadFile(
                        foundItemImageBytes,
                        key,
                        s3Buckets.getBucket()
                );
                successfulUploadedKeys.add(key);

                FoundItemImage foundItemImage = FoundItemImage
                        .builder()
                        .imageUri(foundItemImageId)
                        .serialNo(serialNumber++)
                        .foundItem(founder)
                        .build();

                foundItemImages.add(foundItemImage);
            } catch (IOException e) {
                utils.CleanupUploadedImages(successfulUploadedKeys, s3Buckets.getBucket());
                throw new IllegalArgumentException("Invalid image file: " + e.getMessage(), e);
            } catch (SdkClientException e) {
                utils.CleanupUploadedImages(successfulUploadedKeys, s3Buckets.getBucket());
                throw new RuntimeException("Failed to upload image to S3: " + e.getMessage(), e);
            }
        }

        try {
            foundItemImageRepository.saveAll(foundItemImages);
        } catch (Exception e) {
            utils.CleanupUploadedImages(successfulUploadedKeys, s3Buckets.getBucket());
            throw new RuntimeException("Failed to save image metadata: " + e.getMessage(), e);
        }
    }
}
