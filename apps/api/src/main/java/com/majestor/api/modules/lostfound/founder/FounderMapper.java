package com.majestor.api.modules.lostfound.founder;

import com.majestor.api.modules.lostfound.founder.dto.FoundLostItemRequestDTO;
import com.majestor.api.modules.lostfound.lostitem.LostItem;
import com.majestor.api.modules.user.User;
import org.springframework.stereotype.Component;

@Component
public class FounderMapper {
    public Founder toFounder(
            FoundLostItemRequestDTO foundLostItemRequestDTO,
            LostItem lostItem,
            User userFounder
    ) {
        return Founder
                .builder()
                .foundLocationDescription(foundLostItemRequestDTO.getFoundLocationDescription())
                .foundLocation(foundLostItemRequestDTO.getFoundLocation())
                .foundLostItem(lostItem)
                .founder(userFounder)
                .build();
    }
}
