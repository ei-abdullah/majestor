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

    public LostItemsResponseDTO toLostItemsResponseDTO(LostItem lostItem, byte[] firstImageUri) {
        return LostItemsResponseDTO
                .builder()
                .id(lostItem.getId())
                .title(lostItem.getTitle())
                .status(lostItem.getStatus())
                .ownerId(lostItem.getOwner().getId())
                .ownerEmail(lostItem.getOwner().getEmail())
                .firstImageUri(firstImageUri)
                .createdAt(lostItem.getCreatedAt())
                .build();
    }

    public LostItemResponseDTO toLostItemResponseDto(LostItem lostItem, byte[] imageUri) {
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
    private LostItemAndFoundersResponseDTO.LostItemAndFoundersDTO toLostItemAndFoundersDTO(Founder founder, List<byte[]> foundItemImages) {
        return LostItemAndFoundersResponseDTO.LostItemAndFoundersDTO
                .builder()
                .id(founder.getId())
                .name(founder.getName())
                .phone(founder.getPhone())
                .foundLocationDescription(founder.getFoundLocationDescription())
                .lastLocation(founder.getLastLocation())
                .foundItemImages(foundItemImages)
                .createdAt(founder.getCreatedAt())
                .build();
    }

    private List<LostItemAndFoundersResponseDTO> toLostItemAndFoundersDTOList(List<LostItemAndFoundersResponseDTO.LostItemAndFoundersDTO> lostItemAndFoundersDTOs) {
        if (lostItemAndFoundersDTOs == null || lostItemAndFoundersDTOs.isEmpty()) {
            return List.of();
        }

        return founders.stream()
                .map(this::toLostItemAndFoundersDTO)
                .toList();
    }

    public LostItemAndFoundersResponseDTO toLostItemAndFoundersResponseDTO(
            LostItem lostItem,
            List<byte[]> lostItemImages,
            List<byte[]> foundItemImages
    ) {
        return LostItemAndFoundersResponseDTO
                .builder()
                .id(lostItem.getId())
                .ownerId(lostItem.getOwner().getId())
                .title(lostItem.getTitle())
                .description(lostItem.getDescription())
                .phone(lostItem.getPhone())
                .lastLocationDescription(lostItem.getLastLocationDescription())
                .lostItemImages(lostItemImages)
                .itemFounders(toLostItemAndFoundersDTOList(lostItem.getFounders(), foundItemImages))
                .createdAt(lostItem.getCreatedAt())
                .build();
    }


}
