package com.majestor.api.modules.studyhub.studygroup;

import com.majestor.api.modules.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ratings")
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ratedBy")
    private User ratedBy;

    @ManyToOne
    @JoinColumn(name = "ratedStudyGroup")
    private StudyGroup ratedStudyGroup;

    private Instant createdAt;
    private Instant updatedAt;
}
