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
                .name(foundLostItemRequestDTO.getName())
                .phone(foundLostItemRequestDTO.getPhone())
                .foundLocationDescription(foundLostItemRequestDTO.getFoundLocationDescription())
                .lastLocation(foundLostItemRequestDTO.getLocation())
                .foundLostItem(lostItem)
                .founder(userFounder)
                .build();
    }
}
