package com.majestor.api.modules.user;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findById(Long id);

    Optional<User> findByEmail(String email);

    User findByUsername(String username);

    User findByVerificationToken(String token);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    @Query("""
        SELECT u
        FROM User u
        WHERE LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))
        AND u.university.id = :universityId
        """)
    List<User> searchByEmailInUniversity(
            @Param("query") String query,
            @Param("universityId") Long universityId,
            Pageable pageable
    );
}
