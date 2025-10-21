package com.majestor.api.modules.lostfound.lostitem;

import com.majestor.api.modules.lostfound.founder.Founder;
import com.majestor.api.modules.lostfound.lostitem.dto.CreateLostItemRequestDTO;
import com.majestor.api.modules.lostfound.lostitem.dto.LostItemAndFoundersResponseDTO;
import com.majestor.api.modules.lostfound.lostitem.dto.LostItemResponseDTO;
import com.majestor.api.modules.lostfound.lostitem.dto.LostItemsResponseDTO;
import com.majestor.api.modules.user.User;
import org.springframework.stereotype.Component;

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

    public LostItemResponseDTO toLostItemResponseDto(LostItem lostItem, List<byte[]> imageUris) {
        return LostItemResponseDTO
                .builder()
                .id(lostItem.getId())
                .title(lostItem.getTitle())
                .status(lostItem.getStatus())
                .imageUris(imageUris)
                .ownerId(lostItem.getOwner().getId())
                .createdAt(lostItem.getCreatedAt())
                .build();
    }

    /*
     * LostItemAndFoundersResponseDTO
     */
    private LostItemAndFoundersResponseDTO.LostItemAndFoundersDTO toLostItemAndFoundersDTO(Founder founder) {
        return LostItemAndFoundersResponseDTO.LostItemAndFoundersDTO
                .builder()
                .id(founder.getId())
                .name(founder.getName())
                .phone(founder.getPhone())
                .foundLocationDescription(founder.getFoundLocationDescription())
                .lastLocation(founder.getLastLocation())
                .createdAt(founder.getCreatedAt())
                .build();
    }

    private List<LostItemAndFoundersResponseDTO.LostItemAndFoundersDTO> toLostItemAndFoundersDTOList(List<Founder> founders) {
        if (founders == null) {
            return List.of();
        }

        return founders.stream()
                .map(this::toLostItemAndFoundersDTO)
                .toList();
    }

    public LostItemAndFoundersResponseDTO toLostItemAndFoundersDTO(LostItem lostItem) {
        return LostItemAndFoundersResponseDTO
                .builder()
                .id(lostItem.getId())
                .ownerId(lostItem.getOwner().getId())
                .title(lostItem.getTitle())
                .description(lostItem.getDescription())
                .phone(lostItem.getPhone())
                .lastLocationDescription(lostItem.getLastLocationDescription())
                .itemFounders(toLostItemAndFoundersDTOList(lostItem.getFounders()))
                .createdAt(lostItem.getCreatedAt())
                .build();
    }
}
