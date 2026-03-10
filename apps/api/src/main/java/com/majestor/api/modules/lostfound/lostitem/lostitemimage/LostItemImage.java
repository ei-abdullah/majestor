package com.majestor.api.modules.lostfound.lostitem.lostitemimage;

import com.majestor.api.modules.lostfound.lostitem.LostItem;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.time.Instant;


@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "lost_item_images")
public class LostItemImage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    @NotEmpty(message = "Image URI is required")
    private String imageUri;

    @Column(nullable = false)
    @NotNull(message = "Serial number is required")
    @Positive(message = "Serial number must be a positive number")
    private Long serialNo;

    @NotNull(message = "Lost item is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lost_item_id")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private LostItem lostItem;

    private Instant createdAt;
    private Instant updatedAt;
}
