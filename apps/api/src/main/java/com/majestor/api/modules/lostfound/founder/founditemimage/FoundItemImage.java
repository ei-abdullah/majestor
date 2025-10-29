package com.majestor.api.modules.lostfound.founder.founditemimage;

import com.majestor.api.modules.lostfound.founder.Founder;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
@Table(name = "found_item_images")
public class FoundItemImage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Image URI is required")
    private String imageUri;

    @NotNull(message = "Serial number is required")
    private Long serialNo;

    @NotNull(message = "Found item is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "found_item_id")
    private Founder foundItem;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
