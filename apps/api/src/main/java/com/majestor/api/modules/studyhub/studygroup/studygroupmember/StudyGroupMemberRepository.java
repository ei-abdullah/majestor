package com.majestor.api.modules.studyhub.studygroup.studygroupmember;

import com.majestor.api.modules.studyhub.studygroup.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudyGroupMemberRepository extends JpaRepository<StudyGroupMember, Long> {

    @Query("""
            SELECT COUNT(m)
            FROM StudyGroupMember m
            WHERE m.studyGroupMember.id = :userId
            AND m.leftAt IS NULL
            """)
    long countActiveMemberships(@Param("userId") Long userId);

    @Query("""
            SELECT m.studyGroup
            FROM StudyGroupMember m
            WHERE m.studyGroupMember.id = :userId
            AND m.leftAt IS NULL
            """)
    List<StudyGroup> findActiveGroupsByUserId(@Param("userId") Long userId);

    @Query("""
            SELECT m
            FROM StudyGroupMember m
            WHERE m.studyGroup.id = :studyGroupId
            AND m.studyGroupMember.id = :userId
            AND m.leftAt IS NULL
            """)
    Optional<StudyGroupMember> findActiveMembership(
            @Param("userId") Long userId,
            @Param("studyGroupId") Long studyGroupId
    );
}
