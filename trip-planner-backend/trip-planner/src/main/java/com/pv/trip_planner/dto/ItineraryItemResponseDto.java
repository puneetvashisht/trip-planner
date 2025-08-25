package com.pv.trip_planner.dto;

import com.pv.trip_planner.entities.ItineraryItem;
import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItineraryItemResponseDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private List<ActivityResponseDto> activities;

    public static ItineraryItemResponseDto fromItineraryItem(ItineraryItem item) {
        return ItineraryItemResponseDto.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .startDate(item.getStartDate())
                .endDate(item.getEndDate())
                .location(item.getLocation())
                .activities(item.getActivities() != null ? 
                    item.getActivities().stream()
                        .map(ActivityResponseDto::fromActivity)
                        .collect(Collectors.toList()) : null)
                .build();
    }
}
