package com.majestor.api.modules.studyhub.studygroup.rating;

import com.majestor.api.modules.studyhub.studygroup.StudyGroup;
import com.majestor.api.modules.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByRatedByAndRatedStudyGroup(User user, StudyGroup studyGroup);

    long countByRatedStudyGroup(StudyGroup studyGroup);
}
