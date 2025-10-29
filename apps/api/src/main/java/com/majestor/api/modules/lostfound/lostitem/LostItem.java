package com.majestor.api.modules.lostfound.lostitem;

import com.majestor.api.modules.lostfound.founder.Founder;
import com.majestor.api.modules.lostfound.lostitem.lostitemimage.LostItemImage;
import com.majestor.api.modules.lostfound.shared.LastLocation;
import com.majestor.api.modules.user.User;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "lost_items")
public class LostItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 100, message = "Title must be greater than 2 and less than 100 characters")
    private String title;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^03[0-9]{9}$", message = "Invalid phone number")
    private String phone;

    @NotBlank(message = "Description is required")
    @Size(max = 255, message = "Description must be less than 255 characters")
    private String description;

    @NotBlank(message = "Last location of lost item is required")
    @Size(max = 255, message = "Last location description must be less than 255 characters")
    private String lastLocationDescription;

    @Valid
    @Embedded
    private LastLocation lastLocation;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    private Status status;

    @NotNull(message = "Owner is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @OneToMany(mappedBy = "foundLostItem")
    private List<Founder> founders;

    @NotEmpty(message = "Found item images are required")
    @OneToMany(mappedBy = "lostItem", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @OrderBy("serialNo ASC")
    private List<LostItemImage> lostItemImages;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
