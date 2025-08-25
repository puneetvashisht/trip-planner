package com.pv.trip_planner.dto;

import com.pv.trip_planner.entities.PackingItem;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PackingItemDto {
    private Long id;
    private String name;
    private String category;
    private Boolean isPacked;

    public static PackingItemDto fromPackingItem(PackingItem item) {
        return PackingItemDto.builder()
                .id(item.getId())
                .name(item.getName())
                .category(item.getCategory())
                .isPacked(item.isPacked())
                .build();
    }
}
