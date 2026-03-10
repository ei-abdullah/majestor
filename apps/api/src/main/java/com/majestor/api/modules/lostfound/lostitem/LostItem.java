package com.majestor.api.modules.lostfound.lostitem;

import com.majestor.api.modules.lostfound.founder.Founder;
import com.majestor.api.modules.lostfound.lostitem.lostitemimage.LostItemImage;
import com.majestor.api.modules.lostfound.shared.LastLocation;
import com.majestor.api.modules.user.User;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(
        name = "lost_items",
        indexes = {
                @Index(name = "idx_lost_item_owner", columnList = "owner_id"),
                @Index(name = "idx_lost_item_status", columnList = "status")
        }
)
public class LostItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Title must be greater than 2 and less than 100 characters")
    private String title;

    @Column(nullable = false)
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @Column(nullable = false)
    @NotBlank(message = "Description is required")
    @Size(max = 255, message = "Description must be less than 255 characters")
    private String description;

    @Column(nullable = false)
    @NotBlank(message = "Last location of lost item is required")
    @Size(max = 255, message = "Last location description must be less than 255 characters")
    private String lastLocationDescription;

    @Column(nullable = false)
    @Valid
    @Embedded
    private LastLocation lastLocation;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @NotNull(message = "Status is required")
    private Status status;

    @NotNull(message = "Owner is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "foundLostItem")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Founder> founders;

    @NotEmpty(message = "Found item images are required")
    @OneToMany(mappedBy = "lostItem", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @OrderBy("serialNo ASC")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<LostItemImage> lostItemImages;

    private Instant createdAt;
    private Instant updatedAt;
}
