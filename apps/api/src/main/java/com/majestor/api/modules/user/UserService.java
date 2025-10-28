package com.majestor.api.modules.user;

import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.infra.s3.S3Buckets;
import com.majestor.api.infra.s3.S3Service;
import com.majestor.api.modules.user.dto.GetUserDetailsResponseDTO;
import com.majestor.api.modules.user.dto.UpdateUserDetailsRequestDTO;
import com.majestor.api.modules.utils.Utils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.exception.SdkClientException;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;
    private final Utils utils;

    public GetUserDetailsResponseDTO getUserDetails(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("User id must be provided!");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        byte[] avatarBytes = new byte[0];

        String key = utils.GetUploadUserAvatarKey(user.getId(), user.getAvatar());
        try {
            avatarBytes = s3Service.downloadFile(
                    key,
                    s3Buckets.getBucket()
            );
        } catch (SdkClientException e) {
            log.warn("Failed to download avatar from S3: {}", e.getMessage(), e);
        } catch (Exception e) {
            log.warn("Failed to read avatar from S3: {}", e.getMessage(), e);
        }

        avatarBytes = avatarBytes.length > 0 ? avatarBytes : null;
        return userMapper.toGetUserDetailsResponseDTO(user, avatarBytes);
    }

    @Transactional
    public void updateUserDetails(
            Long userId,
            UpdateUserDetailsRequestDTO requestDTO
    ) {
        /*
         * Remove the image from the aws and upload the new one.
         * Replace the image uri from the database also.
         */

        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("User id must be provided!");
        }

        if (requestDTO == null) {
            throw new IllegalArgumentException("user details cannot be null");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String oldAvatarUri = user.getAvatar();

        if (oldAvatarUri != null && !oldAvatarUri.trim().isEmpty()) {
            String key = utils.GetUploadUserAvatarKey(user.getId(), oldAvatarUri);
            try {
                s3Service.deleteFile(
                        key,
                        s3Buckets.getBucket()
                );
            } catch (SdkClientException e) {
                log.warn("Failed to delete avatar from S3: {}", e.getMessage(), e);
            }
        }

        if (requestDTO.getAvatar() != null && !requestDTO.getAvatar().isEmpty()) {
            String avatarId = UUID.randomUUID().toString();
            String key = utils.GetUploadUserAvatarKey(user.getId(), avatarId);

            try {
                byte[] avatarImageBytes = requestDTO.getAvatar().getBytes();
                s3Service.uploadFile(
                        avatarImageBytes,
                        key,
                        s3Buckets.getBucket()
                );
                user.setAvatar(avatarId);
            } catch (SdkClientException e) {
                utils.CleanupUploadedImages(List.of(key), s3Buckets.getBucket());
                log.error("Failed to upload avatar to S3: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to upload avatar to S3: " + e.getMessage(), e);
            } catch (IOException e) {
                utils.CleanupUploadedImages(List.of(key), s3Buckets.getBucket());
                log.error("Failed to read avatar from request: {}", e.getMessage(), e);
                throw new RuntimeException("Invalid avatar file: " + e.getMessage(), e);
            }
        }

        if (requestDTO.getPersonalEmail() != null && !requestDTO.getPersonalEmail().trim().isEmpty()) {
            user.setPersonalEmail(requestDTO.getPersonalEmail().trim());
        }

        if (requestDTO.getPhone() != null && requestDTO.getPhone().trim().isEmpty()) {
            user.setPhone(requestDTO.getPhone());
        }

        userRepository.save(user);
    }
}
