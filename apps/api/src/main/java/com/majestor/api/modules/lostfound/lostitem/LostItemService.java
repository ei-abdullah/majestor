package com.majestor.api.modules.lostfound.lostitem;

import com.majestor.api.infra.s3.S3Buckets;
import com.majestor.api.infra.s3.S3Service;
import com.majestor.api.modules.lostfound.lostitem.dto.CreateLostItemRequestDTO;
import com.majestor.api.modules.lostfound.lostitem.dto.LostItemAndFoundersResponseDTO;
import com.majestor.api.modules.lostfound.lostitem.dto.LostItemResponseDTO;
import com.majestor.api.modules.lostfound.lostitem.dto.LostItemsResponseDTO;
import com.majestor.api.modules.lostfound.lostitem.lostitemimage.LostItemImage;
import com.majestor.api.modules.lostfound.lostitem.lostitemimage.LostItemImageRepository;
import com.majestor.api.modules.user.User;
import com.majestor.api.modules.user.UserRepository;
import com.majestor.api.modules.utils.Utils;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkClientException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;


@Slf4j
@Service
@RequiredArgsConstructor
public class LostItemService {

    private final LostItemRepository lostItemRepository;
    private final UserRepository userRepository;
    private final LostItemMapper lostItemMapper;
    private final LostItemImageRepository lostItemImageRepository;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;
    private final Utils utils;

    @Transactional
    public void createLostItemRequest(
            CreateLostItemRequestDTO createLostItemRequestDTO,
            Long ownerId
    ) {
        if (createLostItemRequestDTO == null) {
            throw new IllegalArgumentException("CreateLostItemRequestDTO cannot be null");
        }
        if (ownerId == null) {
            throw new IllegalArgumentException("Student ID cannot be null");
        }

        User user = userRepository.findById(ownerId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + ownerId));

        LostItem lostItem = lostItemMapper.toLostItem(createLostItemRequestDTO, user);
        lostItem = lostItemRepository.save(lostItem);


        List<LostItemImage> lostItemImages = new ArrayList<>();
        List<String> successfulUploadedKeys = new ArrayList<>();

        long serialNumber = 1L;
        String lostItemImageId;

        for (MultipartFile image : createLostItemRequestDTO.getLostItemImages()) {
            if (image.isEmpty()) continue;

            try {
                lostItemImageId = UUID.randomUUID().toString();
                byte[] lostItemImageBytes = image.getBytes();
                String key = utils.GetUploadLostItemKey(user.getId(), lostItem.getId(), lostItemImageId);

                s3Service.uploadFile(
                        lostItemImageBytes,
                        key,
                        s3Buckets.getBucket()
                );
                successfulUploadedKeys.add(key);

                LostItemImage lostItemImage = LostItemImage
                        .builder()
                        .imageUri(lostItemImageId)
                        .serialNo(serialNumber++)
                        .lostItem(lostItem)
                        .build();

                lostItemImages.add(lostItemImage);

            } catch (IOException e) {
                utils.CleanupUploadedImages(successfulUploadedKeys, s3Buckets.getBucket());
                throw new IllegalArgumentException("Invalid image file: " + e.getMessage(), e);
            } catch (SdkClientException e) {
                utils.CleanupUploadedImages(successfulUploadedKeys, s3Buckets.getBucket());
                throw new RuntimeException("Failed to upload image to S3: " + e.getMessage(), e);
            }
        }

        try {
            lostItemImageRepository.saveAll(lostItemImages);
        } catch (Exception e) {
            utils.CleanupUploadedImages(successfulUploadedKeys, s3Buckets.getBucket());
            throw new RuntimeException("Failed to save image metadata: " + e.getMessage(), e);

        }
    }

    public Page<LostItemsResponseDTO> findAllLostItems(
            Pageable pageable
    ) {
        /*
         * Get the first imageUii of each lostItem.
         * Then retrieve the image bytes from AWS using imageUri
         * and then append the image to the corresponding lostItem
         */

        Page<LostItem> lostItemsPage = lostItemRepository.findAllLostItems(pageable);

        List<LostItemsResponseDTO> lostItemsResponseList = lostItemsPage.getContent()
                .stream()
                .map(lostItem -> {
                    String imageUri = lostItemImageRepository.getFirstLostItemImageById(lostItem.getId());
                    byte[] imageBytes = null;

                    if (imageUri != null && !imageUri.trim().isEmpty()) {
                        try {
                            String key = utils.GetUploadLostItemKey(lostItem.getOwner().getId(), lostItem.getId(), imageUri);
                            imageBytes = s3Service.downloadFile(key, s3Buckets.getBucket());
                        } catch (SdkClientException e) {
                            log.warn("Failed to download image for lost item {}: {}", lostItem.getId(), e.getMessage());
                        }
                    }

                    return lostItemMapper.toLostItemsResponseDTO(lostItem, imageBytes);
                })
                .toList();

        return new PageImpl<>(lostItemsResponseList, pageable, lostItemsPage.getTotalElements());
    }

    public List<LostItemResponseDTO> findLostItemsByUserId(
            Long ownerId,
            String statusQuery
    ) {
        if (ownerId == null || ownerId <= 0) {
            throw new IllegalArgumentException("Student ID cannot be null or less than 1");
        }

        String status = validateAndNormalizeStatus(statusQuery);

        List<LostItem> lostItems = lostItemRepository.findLostItemsByUserId(ownerId, status);

        if (lostItems.isEmpty()) {
            return new ArrayList<>();
        }

        return lostItems
                .stream()
                .map(lostItem -> {
                    // Images are already loaded due to JOIN FETCH
                    List<byte[]> imageBytes = lostItem.getLostItemImages()
                            .stream()
                            .map(image -> downloadImage(lostItem, image.getImageUri()))
                            .filter(Objects::nonNull)
                            .toList();

                    return lostItemMapper.toLostItemResponseDto(lostItem, imageBytes);
                })
                .toList();
    }

    public List<LostItemAndFoundersResponseDTO> findLostItemWithFounders(
            Long lostItemId
    ) {
        List<LostItem> lostItemsList = lostItemRepository.findLostItemWithFounders(lostItemId);

        return lostItemsList
                .stream()
                .map(lostItemMapper::toLostItemAndFoundersDTO)
                .toList();
    }

    private String validateAndNormalizeStatus(String statusQuery) {
        if (statusQuery == null) {
            return Status.LOST.name();
        }

        String normalizedStatus = statusQuery.trim().toUpperCase();

        try {
            Status.valueOf(normalizedStatus);
            return normalizedStatus;
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + statusQuery +
                    ". Valid values are: " + java.util.Arrays.toString(Status.values()));
        }
    }

    private byte[] downloadImage(LostItem lostItem, String imageUri) {
        if (imageUri == null || imageUri.trim().isEmpty()) {
            return null;
        }

        try {
            String key = utils.GetUploadLostItemKey(lostItem.getOwner().getId(), lostItem.getId(), imageUri);
            return s3Service.downloadFile(key, s3Buckets.getBucket());
        } catch (Exception e) {
            log.warn("Failed to download image {} for lost item {}: {}",
                    imageUri, lostItem.getId(), e.getMessage());
            return null;
        }
    }

    @Transactional
    public void markLostItemFound(Long lostItemId) {
        LostItem lostItem = lostItemRepository.findById(lostItemId)
                .orElseThrow(() -> new EntityNotFoundException("Lost item not found with id: " + lostItemId));

        lostItem.setStatus(Status.FOUND);
        lostItemRepository.save(lostItem);
    }
}
