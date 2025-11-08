package com.majestor.api.modules.lostfound.lostitem;

import com.majestor.api.modules.lostfound.founder.Founder;
import com.majestor.api.modules.lostfound.lostitem.dto.CreateLostItemRequestDTO;
import com.majestor.api.modules.lostfound.lostitem.dto.LostItemAndFoundersResponseDTO;
import com.majestor.api.modules.lostfound.lostitem.dto.LostItemResponseDTO;
import com.majestor.api.modules.lostfound.lostitem.dto.LostItemsResponseDTO;
import com.majestor.api.modules.user.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class LostItemMapper {

    public LostItem toLostItem(CreateLostItemRequestDTO createLostItemRequestDTO, User owner) {
        return LostItem
                .builder()
                .title(createLostItemRequestDTO.getTitle())
                .description(createLostItemRequestDTO.getDescription())
                .phone(createLostItemRequestDTO.getPhone())
                .lastLocationDescription(createLostItemRequestDTO.getLastLocationDescription())
                .lastLocation(createLostItemRequestDTO.getLastLocation())
                .status(Status.LOST)
                .owner(owner)
                .createdAt(LocalDateTime.now())
                .build();
    }

    public LostItemsResponseDTO toLostItemsResponseDTO(LostItem lostItem, String lostItemImageUri) {
        return LostItemsResponseDTO
                .builder()
                .id(lostItem.getId())
                .title(lostItem.getTitle())
                .status(lostItem.getStatus())
                .ownerId(lostItem.getOwner().getId())
                .ownerEmail(lostItem.getOwner().getEmail())
                .lostItemImageUri(lostItemImageUri)
                .createdAt(lostItem.getCreatedAt())
                .build();
    }

    public LostItemResponseDTO toLostItemResponseDto(LostItem lostItem, String imageUri) {
        return LostItemResponseDTO
                .builder()
                .id(lostItem.getId())
                .title(lostItem.getTitle())
                .status(lostItem.getStatus())
                .imageUri(imageUri)
                .ownerId(lostItem.getOwner().getId())
                .createdAt(lostItem.getCreatedAt())
                .build();
    }

    /*
     * LostItemAndFoundersResponseDTO
     */
    public LostItemAndFoundersResponseDTO.LostItemAndFoundersDTO toLostItemAndFoundersDTO(Founder founder, List<String> foundItemImageUris) {
        return LostItemAndFoundersResponseDTO.LostItemAndFoundersDTO
                .builder()
                .id(founder.getId())
                .name(founder.getName())
                .phone(founder.getPhone())
                .foundLocationDescription(founder.getFoundLocationDescription())
                .lastLocation(founder.getLastLocation())
                .foundItemImageUris(foundItemImageUris)
                .createdAt(founder.getCreatedAt())
                .build();
    }

    public LostItemAndFoundersResponseDTO toLostItemAndFoundersResponseDTO(
            LostItem lostItem,
            List<LostItemAndFoundersResponseDTO.LostItemAndFoundersDTO> itemFounders,
            List<String> lostItemImageUris
    ) {
        return LostItemAndFoundersResponseDTO
                .builder()
                .id(lostItem.getId())
                .ownerId(lostItem.getOwner().getId())
                .title(lostItem.getTitle())
                .description(lostItem.getDescription())
                .phone(lostItem.getPhone())
                .lastLocationDescription(lostItem.getLastLocationDescription())
                .itemFounders(itemFounders)
                .lostItemImageUris(lostItemImageUris)
                .createdAt(lostItem.getCreatedAt())
                .build();
    }

}
