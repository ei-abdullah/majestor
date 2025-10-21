package com.majestor.api.modules.lostfound.founder;

import com.majestor.api.modules.lostfound.founder.founditemimage.FoundItemImage;
import com.majestor.api.modules.lostfound.lostitem.LostItem;
import com.majestor.api.modules.lostfound.shared.LastLocation;
import com.majestor.api.modules.user.User;
import jakarta.persistence.*;
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
@Table(name = "founders")
public class Founder {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private String phone;
    private String foundLocationDescription;

    @Embedded
    private LastLocation lastLocation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lost_item_id")
    private LostItem foundLostItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "founder_id")
    private User founder;

    @OneToMany(mappedBy = "foundItem")
    private List<FoundItemImage> foundItemImages;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
