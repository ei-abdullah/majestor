package com.majestor.api.modules.user;

import com.majestor.api.modules.user.dto.GetUserDetailsResponseDTO;
import com.majestor.api.modules.user.dto.UpdateUserDetailsRequestDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public GetUserDetailsResponseDTO getUserDetails(Long userId) {
        return null;
    }

    public void updateUserDetails(
            Long userId,
            UpdateUserDetailsRequestDTO updateUserDetailsRequestDTO
    ) {
        /*
         *Remove the image from the aws and upload the new one.
         * Replace the image uri from the database also.
         */
    }
}
