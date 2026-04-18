package com.majestor.api.modules.user;

import com.majestor.api.infra.exception.ResourceNotFoundException;
import com.majestor.api.infra.s3.S3Buckets;
import com.majestor.api.infra.s3.S3Service;
import com.majestor.api.modules.user.dto.GetUserDetailsResponseDTO;
import com.majestor.api.modules.user.dto.UpdateUserDetailsRequestDTO;
import com.majestor.api.modules.user.dto.UserSearchDTO;
import com.majestor.api.modules.utils.Utils;
import jakarta.transaction.Transactional;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkClientException;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@Validated
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final S3Service s3Service;
    private final S3Buckets s3Buckets;
    private final Utils utils;

    public GetUserDetailsResponseDTO getUserDetails(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        String avatarUri = utils.DownloadUserAvatar(user);

        return userMapper.toGetUserDetailsResponseDTO(user, avatarUri);
    }

    @Transactional
    public void updateUserDetails(
            Long userId,
            UpdateUserDetailsRequestDTO requestDTO
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (requestDTO.getPersonalEmail() != null && !requestDTO.getPersonalEmail().trim().isEmpty()) {
            user.setPersonalEmail(requestDTO.getPersonalEmail().trim());
        }

        if (requestDTO.getPhone() != null && !requestDTO.getPhone().trim().isEmpty()) {
            user.setPhone(requestDTO.getPhone());
        }

        userRepository.save(user);
    }

    @Transactional
    public void updateProfileImage(
            MultipartFile profileImage,
            @NotNull @Positive Long userId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String oldAvatarUri = user.getAvatar();

        // Check for already existing avatar and delete it from S3
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

        // Upload image to S3 and set avatar field
        if (profileImage != null && !profileImage.isEmpty()) {
            String avatarId = UUID.randomUUID().toString();
            String key = utils.GetUploadUserAvatarKey(user.getId(), avatarId);

            try {
                byte[] avatarImageBytes = profileImage.getBytes();
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
    }

    @Transactional
    public void markOnboarded(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setHasOnboarded(Boolean.TRUE);
        userRepository.save(user);
    }

    @Transactional
    public List<UserSearchDTO> searchUsers(String query, Long requestingUserId) {
        User requestingUser = userRepository.findById(requestingUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + requestingUserId));

        Long universityId = requestingUser.getUniversity().getId();

        return userRepository.searchByEmailInUniversity(query, universityId, PageRequest.of(0, 10))
                .stream()
                .filter(u -> !u.getId().equals(requestingUserId))
                .map(u -> UserSearchDTO.builder()
                        .id(u.getId())
                        .username(u.getUsername())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public void updatePushToken(Long userId, String token) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setExpoPushToken(token);
        userRepository.save(user);
    }
}
