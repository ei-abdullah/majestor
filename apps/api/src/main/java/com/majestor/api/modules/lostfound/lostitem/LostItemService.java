package com.majestor.api.modules.lostfound.lostitem;

import com.majestor.api.infra.s3.S3Buckets;
import com.majestor.api.infra.s3.S3Service;
import com.majestor.api.modules.lostfound.founder.Founder;
import com.majestor.api.modules.lostfound.founder.FounderRepository;
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
    private final FounderRepository founderRepository;

    @Transactional
    public void createLostItemRequest(
            CreateLostItemRequestDTO createLostItemRequestDTO,
            Long ownerId
    ) {
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
            List<LostItemImage> savedImage = lostItemImageRepository.saveAll(lostItemImages);
            lostItem.setLostItemImages(savedImage);
            lostItemRepository.save(lostItem);
            log.info("Saved lost item images: {}", savedImage);
        } catch (Exception e) {
            utils.CleanupUploadedImages(successfulUploadedKeys, s3Buckets.getBucket());
            log.error("Failed to save lost item images metadata: {}", e.getMessage());
            throw new RuntimeException("Failed to save image metadata: " + e.getMessage(), e);
        }
    }

    public Page<LostItemsResponseDTO> findAllLostItems(
            Pageable pageable
    ) {
        Page<LostItem> lostItemsPage = lostItemRepository.findAllLostItems(pageable);

        List<LostItemsResponseDTO> lostItemsResponseList = lostItemsPage.getContent()
                .stream()
                .map(lostItem -> {
                    String imageUri = lostItemImageRepository.getFirstLostItemImageById(lostItem.getId());
                    String lostItemImageUri = null;

                    if (imageUri != null && !imageUri.trim().isEmpty()) {
                        try {
                            String key = utils.GetUploadLostItemKey(lostItem.getOwner().getId(), lostItem.getId(), imageUri);
                            lostItemImageUri = s3Service.createPresignedGetUrl(s3Buckets.getBucket(), key);
                        } catch (SdkClientException e) {
                            log.warn("Failed to download image for lost item {}: {}", lostItem.getId(), e.getMessage());
                        }
                    }

                    return lostItemMapper.toLostItemsResponseDTO(lostItem, lostItemImageUri);
                })
                .toList();

        return new PageImpl<>(lostItemsResponseList, pageable, lostItemsPage.getTotalElements());
    }

    public List<LostItemResponseDTO> findLostItemsByUserId(
            Long ownerId,
            String statusQuery
    ) {
        Status status = Status.valueOf(validateAndNormalizeStatus(statusQuery));
        List<LostItem> lostItems = lostItemRepository.findLostItemsByUserId(ownerId, status);

        if (lostItems.isEmpty()) {
            return new ArrayList<>();
        }

        return lostItems
                .stream()
                .map(lostItem -> {
                    String imageUri = lostItemImageRepository
                            .findByLostItemId(lostItem.getId())
                            .stream()
                            .map(image -> downloadLostItemImage(lostItem, image.getImageUri()))
                            .filter(Objects::nonNull)
                            .findFirst()
                            .orElse(null);

                    return lostItemMapper.toLostItemResponseDto(lostItem, imageUri);
                })
                .toList();
    }

    public LostItemAndFoundersResponseDTO findLostItemWithFounders(
            Long lostItemId
    ) {
        LostItem lostItem = lostItemRepository.findById(lostItemId)
                .orElseThrow(() -> new EntityNotFoundException("Lost item not found with id: " + lostItemId));
        lostItem.setLostItemImages(lostItemImageRepository.findImagesByLostItemId(lostItemId));
        lostItem.setFounders(founderRepository.findFoundersByLostItemId(lostItemId));

        List<LostItemAndFoundersResponseDTO.LostItemAndFoundersDTO> foundersDTOs;

        foundersDTOs = lostItem.getFounders()
                .stream()
                .map(founder -> {
                    List<String> foundItemImages = founder.getFoundItemImages()
                            .stream()
                            .map(image -> downloadFoundItemImage(founder, image.getImageUri()))
                            .filter(Objects::nonNull)
                            .toList();
                    return lostItemMapper.toLostItemAndFoundersDTO(founder, foundItemImages);
                })
                .toList();

        return lostItemMapper.toLostItemAndFoundersResponseDTO(
                lostItem,
                foundersDTOs,
                lostItem.getLostItemImages()
                        .stream()
                        .map(image -> downloadLostItemImage(lostItem, image.getImageUri()))
                        .filter(Objects::nonNull)
                        .toList()
        );
    }

    private String validateAndNormalizeStatus(String statusQuery) {
        String normalizedStatus = statusQuery.trim().toUpperCase();

        try {
            Status.valueOf(normalizedStatus);
            return normalizedStatus;
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + statusQuery +
                    ". Valid values are: " + java.util.Arrays.toString(Status.values()));
        }
    }

    private String downloadLostItemImage(LostItem lostItem, String imageUri) {
        if (imageUri == null || imageUri.trim().isEmpty()) {
            return null;
        }

        try {
            String key = utils.GetUploadLostItemKey(lostItem.getOwner().getId(), lostItem.getId(), imageUri);
            return s3Service.createPresignedGetUrl(s3Buckets.getBucket(), key);
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


    private String downloadFoundItemImage(Founder founder, String imageUri) {
        if (imageUri == null || imageUri.trim().isEmpty()) {
            return null;
        }

        try {
            String key = utils.GetUploadFoundItemKey(founder.getFounder().getId(), founder.getId(), imageUri);
            return s3Service.createPresignedGetUrl(s3Buckets.getBucket(), key);
        } catch (Exception e) {
            log.warn("Failed to download image {} for founder {}: {}",
                    imageUri, founder.getId(), e.getMessage());
            return null;
        }
    }
}
