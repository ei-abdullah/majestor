package com.majestor.api.modules.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    Optional<User> findById(Long id);

    User findByUsername(String username);

    User findByVerificationToken(String token);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);


}
