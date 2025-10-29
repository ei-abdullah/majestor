package com.majestor.api.modules.lostfound.lostitem.lostitemimage;

import com.majestor.api.modules.lostfound.lostitem.LostItem;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

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

    @NotEmpty(message = "Image URI is required")
    private String imageUri;

    @NotNull(message = "Serial number is required")
    @Positive(message = "Serial number must be a positive number")
    private Long serialNo;

    @NotNull(message = "Lost item is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lost_item_id")
    private LostItem lostItem;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
