package com.majestor.api.modules.lostfound.founder;

import com.majestor.api.modules.lostfound.founder.founditemimage.FoundItemImage;
import com.majestor.api.modules.lostfound.lostitem.LostItem;
import com.majestor.api.modules.lostfound.shared.LastLocation;
import com.majestor.api.modules.user.User;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "founders")
public class Founder {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be greater than 2 and less than 100 characters")
    private String name;

    @Column(nullable = false)
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @Column(nullable = false)
    @NotBlank(message = "Found location is required")
    @Size(max = 255, message = "Found location description must be less than 255 characters")
    private String foundLocationDescription;

    @Column(nullable = false)
    @Valid
    @Embedded
    private LastLocation lastLocation;

    @NotNull(message = "Lost item must be linked")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lost_item_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private LostItem foundLostItem;

    @NotNull(message = "Founder is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "founder_id")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private User founder;

    @NotEmpty(message = "Found item images are required")
    @OneToMany(mappedBy = "foundItem")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<FoundItemImage> foundItemImages;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
