package com.majestor.api.modules.lostfound.founder.founditemimage;

import com.majestor.api.modules.lostfound.founder.Founder;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.Instant;


@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "found_item_images")
public class FoundItemImage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Image URI is required")
    private String imageUri;

    @Column(nullable = false)
    @NotNull(message = "Serial number is required")
    private Long serialNo;

    @NotNull(message = "Found item is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "found_item_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Founder foundItem;

    private Instant createdAt;
    private Instant updatedAt;
}
